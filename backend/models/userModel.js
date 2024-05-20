/* ---------- require/import dependencies that are needed ---------- */
const db = require("../database/db");
const ExpressError = require("../errorHandlers/expressError");

/* ---------- User Class ---------- */

class User {
  constructor(
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
    dateDeleted = null
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isAdmin = isAdmin;
    this.adress1 = address1;
    this.adress2 = address2;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.phoneNumber = phoneNumber;
    this.dateCreated = dateCreated;
    this.dateDeleted = dateDeleted;
  }

  /* ----- class method that returns all users ----- */
  static async getAll() {
    const results = await db.query(
      `SELECT first_name AS "firstName", last_name AS "lastName", username, email from users`
    );

    return results.rows;
  }
}

module.exports = User;
