require("dotenv").config();
const SECRET_KEY_FALLBACK = require("./fallbackVariables");

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql:///yam_test"
    : "postgresql:///yam";

const SECRET_KEY = process.env.SECRET_KEY || SECRET_KEY_FALLBACK;

const BCRYPT_WORK_FACTOR = 12;

module.exports = { DB_URI, SECRET_KEY, BCRYPT_WORK_FACTOR };
