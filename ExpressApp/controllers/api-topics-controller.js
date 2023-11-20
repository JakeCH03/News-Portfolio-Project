const { getAllTopics } = require("../models/api-topics-model");

exports.getApiTopics = (req, res, next) => {
  getAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
