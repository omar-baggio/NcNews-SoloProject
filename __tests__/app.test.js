const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpointsFile = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET/api/topics", () => {
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

describe("GET/api", () => {
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

describe("GET/api/articles/:article_id", () => {
  test("status: 200, should responds with an article object, containing the properties author, title, article_id, body, topic, created_at, votes and article_img_url ", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        const created_at = new Date(1604394720000).toISOString();
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
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
