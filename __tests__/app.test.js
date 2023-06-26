const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

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
        expect(endpoints).hasOwnProperty("GET /api");
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
