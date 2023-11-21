const {
  getArticle,
  getAllArticles,
  postComment,
} = require("../models/api-articles-model");

exports.getArticleById = (req, res, next) => {
  getArticle(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res) => {
  getAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.postNewComment = (req, res, next) => {
  const comment = req.body;
  const id = req.params.article_id;
  postComment(comment, id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
