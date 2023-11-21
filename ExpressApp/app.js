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
} = require("./controllers/api-articles-controller");
const { invalidInput } = require("./sql-db-errors");

const app = express();

app.use(express.json());

app.get("/api/healthcheck", getApiHealth);

app.get("/api/topics", getApiTopics);

app.get("/api", getApiEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postNewComment);

app.all("*", handleNotFound);

app.use(invalidInput);

module.exports = app;
