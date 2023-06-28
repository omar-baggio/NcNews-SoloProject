const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpointsFile = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status: 200, should respond with an array of topic objects with properties slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("404: responds with error message page not found", () => {
    return request(app)
      .get("/api/invalid_topics")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("page not found");
      });
  });
});

describe("GET /api", () => {
  test("status: 200, should respond with a json file describing each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(expect.objectContaining(endpointsFile));
      });
  });
});

describe("GET /aip", () => {
  test("404: responds with error message page not found", () => {
    return request(app)
      .get("/aip")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("page not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status: 200, should responds with an article object, containing the properties author, title, article_id, body, topic, created_at, votes and article_img_url ", () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body: { article } }) => {
        const created_at = new Date(1604394720000).toISOString();
        expect(article).toEqual(
          expect.objectContaining({
            article_id,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            votes: 0,
          })
        );
      });
  });
});

describe("ERROR: GET /api/articles/:article_id", () => {
  test("400: responds with an error message when passed a bad request", () => {
    const article_id = "invalid_type";
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("input is not valid");
      });
  });

  test("404: responds with an error message when passed a valid endpoint with correct data but does not exist", () => {
    const article_id = 999;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe(`article with id: ${article_id} does not exist`);
      });
  });
});

describe("GET /api/articles", () => {
  test("status: 200, should responds with an article object, containing the properties author, title, article_id, body, topic, created_at, votes, article_img_url and comment_count", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toBeSorted({ descending: true });
        body.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status: 200, should responds with array of comments for a given article", () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        body.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should add a new comment to the comments", () => {
    return request(app)
      .post(`/api/articles/1/comments`)
      .expect(201)
      .send({
        username: "butter_bridge",
        body: "This is awesome!",
      })
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("body", expect.any(String));
        expect(comment).toHaveProperty("article_id", expect.any(Number));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
});
