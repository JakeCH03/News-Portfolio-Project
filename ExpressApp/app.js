const express = require("express");
const { getApiHealth } = require("./controllers/api-healthcheck-controller");
const { handleNotFound } = require("./api-errors");
const { getApiTopics } = require("./controllers/api-topics-controller");
const { getArticleById } = require("./controllers/api-articles-controller");

const app = express();

app.use(express.json());

app.get("/api/healthcheck", getApiHealth);

app.get("/api/topics", getApiTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", handleNotFound);

module.exports = app;
