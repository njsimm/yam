/* ---------- require/import dependencies that are needed ---------- */
const express = require("express");
const jsonschema = require("jsonschema");
const Product = require("../models/productModel");
const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const productNewSchema = require("../schemas/productNew.json");
const productUpdateSchema = require("../schemas/productUpdate.json");
const ExpressError = require("../errorHandlers/expressError");

/* ---------- create needed instances ---------- */
const router = new express.Router();

/* ---------- routes prefixed with '/products' ---------- */

module.exports = router;
