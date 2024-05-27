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

  /** Get all products for a user.
   *
   * Returns [ {id, userId, name, description, price, cost, sku, minutesToMake, type, updatedAt, createdAt}, ...etc ]
   **/
  static async userGetAll(userId) {
    const results = await db.query(
      `SELECT id, user_id AS "userId", name, description, price, cost, sku, minutes_to_make AS "minutesToMake", type, updated_at AS "updatedAt", created_at AS "createdAt" FROM products WHERE user_id=$1`,
      [userId]
    );

    if (!results.rows.length)
      throw new ExpressError(`No products for user with ID of: ${userId}`, 404);
    return results.rows;
  }

  /** Get a product by productId and userId.
   *
   * Returns {id, userId, name, description, price, cost, sku, minutesToMake, type, updatedAt, createdAt}
   *
   * Throws ExpressError if product is not found with associated user.
   **/
  static async getById(userId, productId) {
    const results = await db.query(
      `SELECT id, user_id AS "userId", name, description, price, cost, sku, minutes_to_make AS "minutesToMake", type, updated_at AS "updatedAt", created_at AS "createdAt" FROM products WHERE user_id=$1 AND id=$2`,
      [userId, productId]
    );
    if (!results.rows[0])
      throw new ExpressError(`Product not found with ID of: ${productId}`, 404);

    return results.rows[0];
  }

  /** Update product data with `newData`.
   *
   * This is a partial update and only changes the provided fields.
   *
   * Returns {id, userId, name, description, price, cost, sku, minutesToMake, type, updatedAt, createdAt}
   **/
  static async update(userId, productId, newData) {
    const product = await Product.getById(userId, productId);

    if (newData.name && newData.name !== product.name) {
      await Product.uniqueCheck("name", newData.name, product.userId);
    }

    if (newData.sku && newData.sku !== product.sku) {
      await Product.uniqueCheck("sku", newData.sku, product.userId);
    }

    newData.updatedAt = new Date();

    const { setColumns, values } = prepareUpdateQuery(newData, {
      userId: "user_id",
      minutesToMake: "minutes_to_make",
      updatedAt: "updated_at",
      createdAt: "created_at",
    });

    const productIdSanitizedIdx = "$" + (values.length + 1);

    const sqlQuery = `UPDATE products SET ${setColumns} WHERE id = ${productIdSanitizedIdx} RETURNING id, user_id AS "userId", name, description, price, cost, sku, minutes_to_make AS "minutesToMake", type, updated_at AS "updatedAt", created_at AS "createdAt"`;

    const results = await db.query(sqlQuery, [...values, productId]);

    const updatedProduct = results.rows[0];

    return updatedProduct;
  }

  /** Delete a product.
   *
   * Returns undefined.
   **/
  static async delete(userId, productId) {
    const results = await db.query(
      `DELETE FROM products WHERE user_id=$1 AND id=$2 RETURNING id, name`,
      [userId, productId]
    );

    const product = results.rows[0];

    if (!product)
      throw new ExpressError(`Product not found with ID of: ${productId}`, 404);
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
