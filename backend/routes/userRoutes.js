/* ---------- require/import dependencies that are needed ---------- */
const express = require("express");
const User = require("../models/userModel");
const { createToken } = require("../helpers/functions");
const { ensureLoggedIn } = require("../middleware/auth");

/* ---------- create needed instances ---------- */
const router = new express.Router();

/* ---------- routes prefixed with '/users' ---------- */

/** GET;
 *
 * Returns an array of all users.
 *    [ { username, first_name, last_name, email, is_admin }, etc ]
 *
 * Authorization required: none
 **/
router.get("/", async (req, res, next) => {
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
 * Authorization required: none
 **/
router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.getByUsername(req.params.username);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

/** POST;
 *
 * Register/signup a new user
 *
 * Returns
 *    {user: {username, firstName, lastName, email, isAdmin}, _token }
 *
 * Authorization required: none
 **/
router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    const _token = createToken(user);

    return res.status(201).json({ user, _token });
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
 * Authorization required: none
 **/
router.delete("/:username", async (req, res, next) => {
  try {
    await User.delete(req.params.username);

    return res.status(200).json({ message: `${req.params.username} deleted.` });
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
 * Authorization required: none
 **/
router.patch("/:username", async (req, res, next) => {
  try {
    const user = await User.update(req.params.username, req.body);
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
});

/** POST;
 *
 * Login a user
 *
 * * Returns
 *    {user: {username, firstName, lastName, email, isAdmin}, _token }
 *
 * Authorization required: none
 **/
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body.username, req.body.password);
    const _token = createToken(user);
    return res.status(200).json({ user, _token });
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
