const express = require("express");
const {
  getApiHealth,
  getApiEndpoints,
} = require("./controllers/api-healthcheck-controller");
const { handleNotFound } = require("./api-errors");
const { getApiTopics } = require("./controllers/api-topics-controller");
const {
  getArticleById,
  getArticles,
  getArticleComments,
  postNewComment,
  handleVoteCounter,
} = require("./controllers/api-articles-controller");
const { invalidInput } = require("./sql-db-errors");
const { deleteComment } = require("./controllers/api-comments-controller");
const { getAllUsers } = require("./controllers/api-users-controller");

const app = express();

app.use(express.json());

app.get("/api/healthcheck", getApiHealth);

app.get("/api/topics", getApiTopics);

app.get("/api", getApiEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postNewComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.patch("/api/articles/:article_id", handleVoteCounter);

app.all("*", handleNotFound);

app.use(invalidInput);

module.exports = app;
