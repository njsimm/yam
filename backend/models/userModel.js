/* ---------- require/import dependencies that are needed ---------- */
const db = require("../database/db");
const ExpressError = require("../errorHandlers/expressError");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config/config");
const { prepareUpdateQuery } = require("../helpers/functions");

/* ---------- User Class ---------- */

/** Related functions for users. */
class User {
  constructor({
    id,
    email,
    username,
    password,
    firstName,
    lastName,
    isAdmin,
    address1,
    address2,
    city,
    state,
    zipCode,
    phoneNumber,
    dateCreated,
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isAdmin = isAdmin;
    this.address1 = address1;
    this.address2 = address2;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.phoneNumber = phoneNumber;
    this.dateCreated = dateCreated;
  }

  /** Get all users.
   *
   * Returns an array of User instances.
   **/
  static async getAll() {
    const results = await db.query(
      `SELECT first_name AS "firstName", last_name AS "lastName", username, email FROM users ORDER BY last_name`
    );

    return results.rows.map((userInfo) => new User(userInfo));
  }

  /** Get a user by username.
   *
   * Returns a User instance.
   *
   * Throws ExpressError if user not found.
   **/
  static async getByUsername(username) {
    const results = await db.query(
      `SELECT id, email, username, first_name AS "firstName", last_name AS "lastName", address_1 AS "address1", address_2 AS "address2", city, state, zip_code AS "zipCode", phone_number AS "phoneNumber", date_created AS "dateCreated" FROM users WHERE username=$1`,
      [username]
    );

    if (!results.rows[0]) {
      throw new ExpressError(`Not Found: ${username}`, 404);
    } else {
      return new User(results.rows[0]);
    }
  }

  /** Register a new user with data.
   *
   * Returns a new User instance.
   *
   * The uniqueCheck method throws an ExpressError if the username or email is already taken.
   **/
  static async register({
    email,
    username,
    password,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zipCode,
    phoneNumber,
  }) {
    await User.uniqueCheck("username", username);

    await User.uniqueCheck("email", email);

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const results = await db.query(
      `INSERT INTO users (email, username, password, first_name, last_name, address_1, address_2, city, state, zip_code, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING email, username, first_name AS "firstName", last_name AS "lastName", address_1 AS "address1", address_2 AS "address2", city, state, zip_code AS "zipCode", phone_number AS "phoneNumber", date_created AS "dateCreated"`,
      [
        email,
        username,
        hashedPassword,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zipCode,
        phoneNumber,
      ]
    );
    return new User(results.rows[0]);
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

  /** Delete a user.
   *
   * Returns undefined.
   **/
  async delete() {
    await db.query(`DELETE FROM users WHERE username=$1`, [this.username]);
  }

  /** Update user data with `newData`.
   *
   * This is a partial update and only changes the provided fields.
   *
   * Data can include: { firstName, lastName, password, email, isAdmin, address1, address2, city, state, zipCode, phoneNumber }
   *
   * Returns an updated User instance
   **/
  async update(originalUsername, newData) {
    if (newData.username && newData.username !== this.username) {
      await User.uniqueCheck("username", newData.username);
    }

    if (newData.email && newData.email !== this.email) {
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
      address1: "address_1",
      address2: "address_2",
      zipCode: "zip_code",
      phoneNumber: "phone_number",
    });

    const usernameSanitizedIdx = "$" + (values.length + 1);

    const sqlQuery = `UPDATE users SET ${setColumns} WHERE username = ${usernameSanitizedIdx} RETURNING username, email, first_name AS "firstName", last_name AS "lastName", address_1 AS "address1", address_2 AS "address2", city, state, zip_code AS "zipCode", phone_number AS "phoneNumber"`;

    const results = await db.query(sqlQuery, [...values, originalUsername]);

    const updatedUser = results.rows[0];

    // This is a safeguard to ensure password is not included in the response
    delete updatedUser.password;

    return new User(updatedUser);
  }
}

module.exports = User;
