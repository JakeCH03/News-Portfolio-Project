const { checkExists } = require("../models/api-checkExists-model");
const { deleteCommentById } = require("../models/api-comments-model");

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;

  Promise.all([
    checkExists("comments", "comment_id", id),
    deleteCommentById(id),
  ])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
