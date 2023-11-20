const express = require("express");
const { getApiHealth } = require("./controllers/api-healthcheck-controller");
const { handleNotFound } = require("./api-errors");
const { getApiTopics } = require("./controllers/api-topics-controller");

const app = express();

app.use(express.json());

app.get("/api/healthcheck", getApiHealth);

app.get("/api/topics", getApiTopics);

app.all("*", handleNotFound);

module.exports = app;
