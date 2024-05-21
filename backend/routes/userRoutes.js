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

/* ----- POST; create a user ----- */

module.exports = router;
