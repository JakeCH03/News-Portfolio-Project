const {
  getArticle,
  getAllArticles,
  getAllComments,
  updateVotes,
} = require("../models/api-articles-model");
const { checkExists } = require("../models/api-checkExists-model");

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

exports.getArticleComments = (req, res, next) => {
  const articlePromises = [getAllComments(req.params.article_id)];

  if (req.params.article_id) {
    articlePromises.push(
      checkExists("articles", "article_id", req.params.article_id)
    );
  }

  Promise.all(articlePromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.handleVoteCounter = (req, res, next) => {
  const id = req.params.article_id;
  const votes = req.body;

  const articlePromises = [];

  if (id) {
    articlePromises.push(checkExists("articles", "article_id", id));
  }

  articlePromises.push(updateVotes(votes, id));

  Promise.all(articlePromises)
    .then((resolvedPromises) => {
      const article = resolvedPromises[1];
      res.status(200).send({ article });
    })
    .catch(next);
};
