/* ---------- require/import dependencies that are needed ---------- */
const express = require("express");
const User = require("../models/userModel");

/* ---------- create needed instances ---------- */
const router = new express.Router();

/* ---------- routes prefixed with '/users' ---------- */

/** GET;
 *
 * Returns all users.
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
 * Returns a user by username
 *
 * Authorization required: none
 **/
router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.getByUsername(username);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

/** POST;
 *
 * Registers and returns a new user.
 *
 * Authorization required: none
 **/
router.post("/register", async (req, res, next) => {
  try {
    const {
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
    } = req.body;

    const user = await User.register({
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
    });

    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
});

/** DELETE;
 *
 * Deletes a user by username.
 *
 * Authorization required: none
 **/
router.delete("/:username", async (req, res, next) => {
  try {
    const user = await User.getByUsername(req.params.username);

    await user.delete();

    return res.status(200).json({ message: `${user.username} deleted.` });
  } catch (error) {
    return next(error);
  }
});

/** PATCH;
 *
 * Update a user's info by username
 *
 * Returns updated user instance
 *
 * Authorization required: none
 **/
router.patch("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.getByUsername(username);
    const updatedUser = await user.update(username, req.body);
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
