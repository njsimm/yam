/* ---------- require/import dependencies that are needed ---------- */
const ExpressError = require("./errorHandlers/expressError");
const express = require("express");
const morgan = require("morgan");

/* ---------- require/import routes folders' contents ---------- */
const userRoutes = require("./routes/userRoutes");

/* ---------- create needed instances ---------- */
const app = express();

/* ---------- middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ---------- require/import routes ---------- */
app.use("/users", userRoutes);

/* ---------- Error Handlers ---------- */

/* ----- 404 Errors ----- */
app.use((req, res, next) => {
  return new ExpressError("Not Found", 404);
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
