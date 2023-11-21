const { getArticle, getAllArticles } = require("../models/api-articles-model");

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
