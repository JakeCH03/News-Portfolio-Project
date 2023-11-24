const format = require("pg-format");
const db = require("../../db/connection");

exports.checkExists = (table, column, value) => {
  const queryString = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  return db.query(queryString, [value]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  });
};

exports.checkExistsColumn = (table, column) => {
  const queryString = format(`SELECT %I FROM %I`, column, table);
  return db.query(queryString)
};
