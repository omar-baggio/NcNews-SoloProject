const express = require("express");
const request = require("./db/connection");
const { getAllTopics } = require("./controller/topics.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);

module.exports = app;
