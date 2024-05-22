/* ---------- require/import dependencies that are needed ---------- */
const express = require("express");
const User = require("../models/userModel");

/* ---------- create needed instances ---------- */
const router = new express.Router();

/* ---------- routes prefixed with '/users' ---------- */

/* ----- GET; returns all users ----- */
router.get("/", async (req, res, next) => {
  try {
    const users = await User.getAll();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

/* ----- GET; user by username ----- */
router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.getByUsername(username);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

/* ----- POST; register new user ----- */
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

module.exports = router;
