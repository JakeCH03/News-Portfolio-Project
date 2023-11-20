const getArticle = require("../models/api-articles-model");

exports.getArticleById = (req, res) => {
  getArticle(req.params.article_id).then((article) => res.status(200).send({ article }));
};
