const { getAllTopics } = require("../models/api-topics-model");

exports.getApiTopics = (req, res, next) => {
  getAllTopics().then((topics) => {
    if (topics.length === 0) {
      res.status(404).send({ msg: "No Contents Found" });
    } else {
      res.status(200).send({ topics });
    }
  });
};
