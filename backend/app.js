/* ---------- require/import dependencies that are needed ---------- */
const ExpressError = require("./errorHandlers/expressError");
const express = require("express");
const morgan = require("morgan");
const { authenticateJWT } = require("./middleware/auth");

/* ---------- require/import routes folders' contents ---------- */
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

/* ---------- create needed instances ---------- */
const app = express();

/* ---------- middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(authenticateJWT);

/* ---------- require/import routes ---------- */
app.use("/users", userRoutes);
app.use("/users/:username/products", productRoutes);

/* ---------- Error Handlers ---------- */

/* ----- 404 Errors ----- */
app.use((req, res, next) => {
  return next(new ExpressError("Not Found", 404));
});

/* ----- Generic Error Handler; anything unhandles reaches here ----- */
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(error.stack);
  }
  const status = error.status || 500;
  const message = error.message;

  return res.status(status).json({
    error: { message, status },
  });
});

/* ---------- exports ---------- */
module.exports = app;
