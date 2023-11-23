const {
  getArticle,
  getAllArticles,
  getAllComments,
  postComment,
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

exports.getArticles = (req, res, next) => {
  const topic = req.query.topic;

  const articlesPromises = [];

  if (topic) {
    articlesPromises.push(checkExists("topics", "slug", topic));
  }

  articlesPromises.push(getAllArticles(topic));

  Promise.all(articlesPromises)
    .then((resolvedPromises) => {
      let articles = "";
      if (resolvedPromises.length > 1) {
        articles = resolvedPromises[resolvedPromises.length - 1];
      } else {
        articles = resolvedPromises[0];
      }

      res.status(200).send({ articles });
    })
    .catch(next);
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
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};
