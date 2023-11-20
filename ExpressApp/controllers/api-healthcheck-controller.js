const endpoints = require("../../endpoints.json");

exports.getApiHealth = (req, res) => {
  res.status(200).send();
};

exports.getApiEndpoints = (req, res) => {
  res.status(200).send({ endpoints });
};
