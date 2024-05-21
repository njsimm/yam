/* ---------- require/import dependencies that are needed ---------- */
const db = require("../database/db");
const ExpressError = require("../errorHandlers/expressError");

/* ---------- User Class ---------- */

class User {
  constructor({
    id,
    email,
    username,
    password,
    firstName,
    lastName,
    isAdmin = false,
    address1,
    address2 = null,
    city,
    state,
    zipCode,
    phoneNumber = null,
    dateCreated,
    dateDeleted = null,
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
      `SELECT id, email, username, first_name AS "firstName", last_name AS "lastName", is_admin AS "isAdmin", address_1 AS "address1", address_2 AS "address2", city, state, zip_code AS "zipCode", phone_number AS "phoneNumber", date_created AS "dateCreated", date_deleted AS "dateDeleted" FROM users WHERE username=$1`,
      [username]
    );

    if (!results.rows[0]) {
      throw new ExpressError(`Not Found: ${username}`, 404);
    } else {
      return new User(results.rows[0]);
    }
  }

  /* ----- Creates a user ----- */
}

module.exports = User;
