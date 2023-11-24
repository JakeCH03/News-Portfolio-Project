const format = require("pg-format");
const db = require("../../db/connection");

exports.getArticle = (id, next) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic,  articles.body, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) as comment_count 
            FROM articles 
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            WHERE articles.article_id=$1
            GROUP BY articles.article_id`,
      [id]
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

exports.getAllArticles = (topic, sort = "created_at", order = "DESC") => {
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) as comment_count
                     FROM articles
                     LEFT JOIN comments
                     ON articles.article_id = comments.article_id`;

  if (!["ASC", "DESC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (topic) {
    queryString += ` WHERE articles.topic='${topic}'`;
  }

  queryString += format(
    ` GROUP BY articles.article_id ORDER BY %I %s`,
    sort,
    order
  );

  return db.query(queryString).then(({ rows }) => rows);
};

exports.getAllComments = (id) => {
  return db
    .query(
      `
        SELECT * 
        FROM comments 
        WHERE comments.article_id=$1 
        ORDER BY comments.created_at DESC
      `,
      [id]
    )
    .then(({ rows }) => rows);
};

exports.postComment = ({ username, comment }, id) => {
  if (typeof comment !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db
    .query(
      `
        INSERT INTO comments (body, author, article_id) 
        VALUES ($1, $2, $3) 
        RETURNING *;
      `,
      [comment, username, id]
    )
    .then(({ rows }) => rows);
};

exports.updateVotes = ({ inc_votes }, id) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *
  `,
      [inc_votes, id]
    )
    .then(({ rows }) => rows);
};
