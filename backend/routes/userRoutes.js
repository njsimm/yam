/* ---------- require/import dependencies that are needed ---------- */
const express = require("express");
const jsonschema = require("jsonschema");
const User = require("../models/userModel");
const { createToken } = require("../helpers/functions");
const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const userRegisterSchema = require("../schemas/userRegister.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const userLoginSchema = require("../schemas/userLogin.json");
const ExpressError = require("../errorHandlers/expressError");

/* ---------- create needed instances ---------- */
const router = new express.Router();

/* ---------- routes prefixed with '/users' ---------- */

/** POST;
 *
 * Register/signup a new user
 *
 * Returns
 *    {user: {username, firstName, lastName, email, isAdmin}, token }
 *
 * Authorization required: none
 **/
router.post("/register", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((error) => error.stack);
      throw new ExpressError(errors, 400);
    }

    const user = await User.register(req.body);
    const token = createToken(user);

    return res.status(201).json({ user, token });
  } catch (error) {
    return next(error);
  }
});

/** POST;
 *
 * Login a user
 *
 * * Returns
 *    {user: {username, firstName, lastName, email, isAdmin}, token }
 *
 * Authorization required: none
 **/
router.post("/login", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userLoginSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((error) => error.stack);
      throw new ExpressError(errors, 400);
    }

    const user = await User.authenticate(req.body.username, req.body.password);
    const token = createToken(user);
    return res.status(200).json({ user, token });
  } catch (error) {
    return next(error);
  }
});

/** GET;
 *
 * Returns an array of all users.
 *    [ { username, first_name, last_name, email, is_admin }, etc ]
 *
 * Authorization required: admin
 **/
router.get("/", ensureAdmin, async (req, res, next) => {
  try {
    const users = await User.getAll();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

/** GET;
 *
 * Returns a user, searched by username.
 *    { username, first_name, last_name, email, is_admin }
 *
 * Authorization required: admin or same user as username
 **/
router.get("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const user = await User.getByUsername(req.params.username);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

/** PATCH;
 *
 * Update a user's info given input of username
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same user as username
 **/
router.patch("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((error) => error.stack);
      throw new ExpressError(errors, 400);
    }

    const user = await User.update(req.params.username, req.body);
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
});

/** DELETE;
 *
 * Deletes a user given input of username.
 *
 * Returns { message: `${username} deleted.` }
 *
 * Authorization required: admin or same user as username
 **/
router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      await User.delete(req.params.username);

      return res
        .status(200)
        .json({ message: `${req.params.username} deleted.` });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
