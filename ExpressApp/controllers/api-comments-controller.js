const { checkExists } = require("../models/api-checkExists-model");
const { deleteCommentById } = require("../models/api-comments-model");

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;

  const commentPromises = [];

  if (id) {
    commentPromises.push(checkExists("comments", "comment_id", id));
  }

  commentPromises.push(deleteCommentById(id));

  Promise.all(commentPromises)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
