/* ---------- require/import dependencies that are needed ---------- */
const ExpressError = require("../errorHandlers/expressError");

/* ----- Functions ----- */

/**
 * Helper function for preparing data for an SQL update query.
 *
 * This is called by a function to make the SET clause of an UPDATE SQL statement.
 *
 * @param {Object} dataToUpdate - The data to update, with field names as keys.
 * @param {Object} jsToSql - Maps JS-style data fields to database column names like { firstName: "first_name", zipCode: "zip_code", username: "username" }
 *
 * @returns {Object} - An object containing the SQL SET clause and the values to update.
 * @returns {string} setColumns - The SQL SET clause.
 * @returns {Array} values - The values to update.
 *
 * @example {firstName: 'John', zipCode: 12345, email: 'john@mail.com'} =>
 *   { setColumns: '"first_name"=$1, "zip_code"=$2, "email"=$3',
 *     values: ['John', 12345, 'john@mail.com'] }
 */
function prepareUpdateQuery(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new ExpressError("No data", 400);

  const setColumns = keys.map((columnName, idx) => {
    return `"${jsToSql[columnName] || columnName}"=$${idx + 1}`;
  });

  return {
    setColumns: setColumns.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { prepareUpdateQuery };
