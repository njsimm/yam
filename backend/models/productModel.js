/* ---------- require/import dependencies that are needed ---------- */
const db = require("../database/db");
const ExpressError = require("../errorHandlers/expressError");
const { prepareUpdateQuery } = require("../helpers/functions");

/* ---------- Product Class ---------- */

/** Related functions for products. */

class Product {
  /** Creates a new product
   *
   * Returns {id, userId, name, description, price, cost, sku, minutesToMake, type, updatedAt, createdAt}
   *
   * The uniqueCheck method throws an ExpressError if the name or sku is already taken by the same user.
   **/
  static async create(
    { name, description, price, cost, sku, minutesToMake, type },
    userId
  ) {
    await Product.uniqueCheck("name", name, userId);
    await Product.uniqueCheck("sku", sku, userId);

    const results = await db.query(
      `INSERT INTO products (user_id, name, description, price, cost, sku, minutes_to_make, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, user_id AS "userId", name, description, price, cost, sku, minutes_to_make AS "minutesToMake", type, updated_at AS "updatedAt", created_at AS "createdAt"`,
      [userId, name, description, price, cost, sku, minutesToMake, type]
    );

    const product = results.rows[0];

    return product;
  }

  /** Check for unique name or sku.
   *
   * Throws ExpressError if the field value is not unique for the user.
   **/
  static async uniqueCheck(fieldStr, inputVar, userId) {
    const results = await db.query(
      `SELECT ${fieldStr} FROM products WHERE ${fieldStr}=$1 AND user_id=$2`,
      [inputVar, userId]
    );

    if (results.rows[0]) {
      throw new ExpressError(`${fieldStr} taken: ${inputVar}`, 409);
    }
  }
}

module.exports = Product;
