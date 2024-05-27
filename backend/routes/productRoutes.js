/* ---------- require/import dependencies that are needed ---------- */
const express = require("express");
const jsonschema = require("jsonschema");
const Product = require("../models/productModel");
const {
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  ensureLoggedIn,
} = require("../middleware/auth");
const productNewSchema = require("../schemas/productNew.json");
const productUpdateSchema = require("../schemas/productUpdate.json");
const ExpressError = require("../errorHandlers/expressError");

/* ---------- create needed instances ---------- */
const router = new express.Router();

/* ---------- routes prefixed with '/products' ---------- */

/** POST;
 *
 * Create a product
 *
 * Returns {id, userId, name, description, price, cost, sku, minutesToMake, type, updatedAt, createdAt}
 *
 * Authorization required: user must be logged in
 **/

router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, productNewSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((error) => error.stack);
      throw new ExpressError(errors, 400);
    }

    const product = await Product.create(req.body, req.user.id);
    return res.status(201).json({ product });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
