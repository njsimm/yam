/* ---------- require/import dependencies that are needed ---------- */
const db = require("../database/db");
const ExpressError = require("../errorHandlers/expressError");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config/config");
const { prepareUpdateQuery } = require("../helpers/functions");

/* ---------- User Class ---------- */

/** Related functions for users. */

class User {
  /** Register/signup a new user
   *
   * Returns { username, firstName, lastName, email, isAdmin, id }
   *
   * The uniqueCheck method throws an ExpressError if the username or email is already taken.
   **/
  static async register({ email, username, password, firstName, lastName }) {
    await User.uniqueCheck("username", username);

    await User.uniqueCheck("email", email);

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const results = await db.query(
      `INSERT INTO users (email, username, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING email, username, first_name AS "firstName", last_name AS "lastName", is_admin AS "isAdmin", id`,
      [email, username, hashedPassword, firstName, lastName]
    );
    const user = results.rows[0];

    return user;
  }

  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin, id }
   *
   * Throws ExpressError if user not found or wrong password/username.
   **/
  static async authenticate(username, password) {
    const results = await db.query(
      `SELECT username, password, email, first_name AS "firstName", last_name AS "lastName", is_admin AS "isAdmin", id FROM users WHERE username=$1`,
      [username]
    );
    const user = results.rows[0];

    if (!user) {
      throw new ExpressError(`Username not found: ${username}`, 404);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new ExpressError("Incorrect username/password", 401);
    } else {
      // This is a safeguard to ensure password is not included in the response
      delete user.password;

      return user;
    }
  }

  /** Get all users.
   *
   * Returns [ { username, first_name, last_name, email, is_admin, id }, etc ]
   * Ordered by last_name
   **/
  static async getAll() {
    const results = await db.query(
      `SELECT first_name AS "firstName", last_name AS "lastName", username, email, is_admin AS "isAdmin", id FROM users ORDER BY last_name`
    );

    return results.rows;
  }

  /** Get a user by id.
   *
   * Returns { username, first_name, last_name, email, is_admin, id }
   *
   * Throws ExpressError if user not found.
   **/
  static async getById(id) {
    const results = await db.query(
      `SELECT email, username, first_name AS "firstName", last_name AS "lastName", is_admin AS "isAdmin", id FROM users WHERE id=$1`,
      [id]
    );

    if (!results.rows[0]) {
      throw new ExpressError(`User not found with id: ${id}`, 404);
    } else {
      return results.rows[0];
    }
  }

  /** Update user data with `newData`.
   *
   * This is a partial update and only changes the provided fields.
   *
   * Returns { username, firstName, lastName, email, isAdmin, id }
   **/
  static async update(id, newData) {
    const user = await User.getById(id);

    if (newData.username && newData.username !== user.username) {
      await User.uniqueCheck("username", newData.username);
    }

    if (newData.email && newData.email !== user.email) {
      await User.uniqueCheck("email", newData.email);
    }

    if (newData.password) {
      newData.password = await bcrypt.hash(
        newData.password,
        BCRYPT_WORK_FACTOR
      );
    }

    const { setColumns, values } = prepareUpdateQuery(newData, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });

    const idSanitizedIdx = "$" + (values.length + 1);

    const sqlQuery = `UPDATE users SET ${setColumns} WHERE id = ${idSanitizedIdx} RETURNING username, email, first_name AS "firstName", last_name AS "lastName", is_admin AS "isAdmin", id`;

    const results = await db.query(sqlQuery, [...values, id]);

    const updatedUser = results.rows[0];

    // This is a safeguard to ensure password is not included in the response
    delete updatedUser.password;

    return updatedUser;
  }

  /** Delete a user.
   *
   * Returns undefined.
   **/
  static async delete(id) {
    const results = await db.query(
      `DELETE FROM users WHERE id=$1 RETURNING username`,
      [id]
    );
    const user = results.rows[0];
    if (!user) throw new ExpressError(`User not found with id: ${id}`, 404);
  }

  /** Check for unique email or username.
   *
   * Throws ExpressError if the field value is not unique.
   **/
  static async uniqueCheck(fieldStr, inputVar) {
    const results = await db.query(
      `SELECT ${fieldStr} FROM users WHERE ${fieldStr}=$1`,
      [inputVar]
    );

    if (results.rows[0]) {
      throw new ExpressError(`${fieldStr} taken: ${inputVar}`, 409);
    }
  }
}

module.exports = User;
