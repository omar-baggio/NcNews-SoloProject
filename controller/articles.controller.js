const {
  selectArticleById,
  selectAllArticles,
  selectCommentsById,
  addCommentsById,
  changeArticleById,
} = require("../model/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsById(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => next(err));
};

exports.postCommentsById = (req, res, next) => {
  const postBody = req.body;
  const { article_id } = req.params;

  addCommentsById(postBody, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  changeArticleById(article_id, body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => next(err));
};
