const db = require("../../db/connection");

exports.getArticle = (id, next) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return rows;
      }
    })
    .catch(next);
};

exports.getAllArticles = (next) => {
  return db
    .query(
      `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) as comment_count
    FROM articles
    INNER JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes
    ORDER BY articles.created_at DESC;
    `
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return rows;
      }
    })
    .catch(next);
};