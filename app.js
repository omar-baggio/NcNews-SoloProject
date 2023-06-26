const express = require("express");
const request = require("./db/connection");
const { getAllTopics } = require("./controller/topics.controller");
const { getApi } = require("./controller/api.controller");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.all("/*", (req, res, next) =>
  res.status(404).send({ message: "page not found" })
);

module.exports = app;
