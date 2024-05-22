/* ---------- require/import dependencies that are needed ---------- */
const db = require("../database/db");
const ExpressError = require("../errorHandlers/expressError");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config/config");

/* ---------- User Class ---------- */

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
    dateDeleted,
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
    this.dateDeleted = dateDeleted;
  }

  /* ----- returns an array of all users ----- */
  static async getAll() {
    const results = await db.query(
      `SELECT first_name AS "firstName", last_name AS "lastName", username, email FROM users ORDER BY last_name`
    );

    return results.rows.map((userInfo) => new User(userInfo));
  }

  /* ----- returns single user ----- */
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

  /* ----- Creates/registers a user ----- */
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
    const uniqueCheckUsername = await db.query(
      `SELECT username FROM users WHERE username=$1`,
      [username]
    );
    if (uniqueCheckUsername.rows[0]) {
      throw new ExpressError(`Username taken: ${username}`);
    }

    const uniqueCheckEmail = await db.query(
      `SELECT email FROM users WHERE email=$1`,
      [email]
    );
    if (uniqueCheckEmail.rows[0]) {
      throw new ExpressError(`Email taken: ${email}`);
    }

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
}

module.exports = User;
