const express = require("express");
const request = require("./db/connection");
const { getAllTopics } = require("./controller/topics.controller");
const { getApi } = require("./controller/api.controller");
const {
  getArticleById,
  getAllArticles,
  getCommentsById,
  postCommentsById,
} = require("./controller/articles.controller");

const app = express();

app.get("/api/articles/:article_id", getArticleById);

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.all("/*", (req, res, next) =>
  res.status(404).send({ message: "page not found" })
);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "input is not valid" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

module.exports = app;
