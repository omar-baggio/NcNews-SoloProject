const express = require("express");
const request = require("./db/connection");
const { getAllTopics } = require("./controller/topics.controller");
const { getApi } = require("./controller/api.controller");
const { deleteComment } = require("./controller/comments.controller");
const { getAllUsers } = require("./controller/users.controller");
const {
  getArticleById,
  getAllArticles,
  getCommentsById,
  postCommentsById,
  updateArticleById,
} = require("./controller/articles.controller");
const { psqlErrors, customErrors, internalServerError } = require("./errors");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/articles/:article_id", getArticleById);

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postCommentsById);

app.patch("/api/articles/:article_id", updateArticleById);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", (req, res, next) =>
  res.status(404).send({ message: "page not found" })
);

// POSTGRESS ERRORS

app.use(psqlErrors);

// CUSTOM ERRORS

app.use(customErrors);

// INTERNAL SERVER ERROR

app.use(internalServerError);

// PATH NOT FOUND ERROR

app.use((req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
