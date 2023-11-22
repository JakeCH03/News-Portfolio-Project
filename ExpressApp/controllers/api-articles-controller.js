const {
  getArticle,
  getAllArticles,
  getAllComments,
  postComment,
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

exports.postNewComment = (req, res, next) => {
  const comment = req.body;
  const id = req.params.article_id;

  const commentPromises = [];

  if (id) {
    commentPromises.push(checkExists("articles", "article_id", id));
  }

  if (comment.username) {
    commentPromises.push(checkExists("users", "username", comment.username));
  }

  commentPromises.push(postComment(comment, id));

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comment = resolvedPromises[2];
      res.status(201).send({ comment });
    })
    .catch(next);
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
