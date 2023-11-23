const { getUsers } = require("../models/api-users-model");

exports.getAllUsers = (req, res) => {
  getUsers().then((users) => {
    res.status(200).send({ users });
  });
};
