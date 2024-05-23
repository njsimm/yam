/* ---------- require/import dependencies that are needed ---------- */
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config");
const ExpressError = require("../errorHandlers/expressError");

/* ---------- middleware to run ---------- */

/**
 * Middleware to authenticate a user via JWT.
 *
 * This middleware function verifies the JWT provided in the request body (_token).
 * If the token is valid, it attaches the payload to the request object as req.user.
 * If the token is not valid or missing, the request proceeds without attaching the user.
 *
 * @example
 * app.use(authenticateJWT);
 */
function authenticateJWT(req, res, next) {
  try {
    const payload = jwt.verify(req.body._token, SECRET_KEY);

    req.user = payload;

    return next();
  } catch (error) {
    return next();
  }
}

/**
 * Middleware to ensure the user is logged in.
 *
 * This middleware function checks if req.user is set from the authenticateJWT middleware function.
 * If the user is not logged in (no req.user from authenticateJWT), it throws an ExpressError with a 401 status code.
 * This middleware is used to protect routes that require a user to be authenticated.
 * If the user is logged in, it proceeds.
 *
 * @throws {ExpressError} - Throws an error if the user is not logged in.
 *
 * @example
 * router.get('/users/preferences', ensureLoggedIn, (req, res, next) => {
 *   // route handler code here
 * });
 */
function ensureLoggedIn(req, res, next) {
  try {
    if (!req.user) throw new ExpressError("Unauthorized", 401);
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { authenticateJWT, ensureLoggedIn };
