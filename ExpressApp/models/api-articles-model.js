const db = require("../../db/connection");

exports.getArticle = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => console.log(rows));
};
