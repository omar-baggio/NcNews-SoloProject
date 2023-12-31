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
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("404: responds with an error message when passed a valid endpoint with correct data but does not exist", () => {
    const article_id = 9999;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Not Found`);
      });
  });
});

describe("GET /api/articles", () => {
  test("status: 200, should responds with an article object, containing the properties author, title, article_id, body, topic, created_at, votes, article_img_url and comment_count", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)

      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSorted({ descending: true });
        articles.forEach((article) => {
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
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          expect(comments).toBeSorted({ descending: true });
        });
      });
  });

  test("200: responds with a empty comment array when article exists but no comment posted", () => {
    const article_id = 2;

    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Object);
        expect(comments).toEqual([]);
        expect(comments).toHaveLength(0);
      });
  });
});

describe("ERROR:GET /api/articles/:article_id/comments", () => {
  test("400: responds with an error message when passed a bad request", () => {
    const article_id = "invalid_type";
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("404: responds with an error message when passed a valid endpoint with correct data but does not exist", () => {
    const article_id = 9999;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Not Found`);
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

describe("ERROR: POST /api/articles/:article_id/comments", () => {
  test("400: responds with an error message when passed a bad request", () => {
    const article_id = "invalid_type";
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("404: responds with an error message when we try to post a comment to an article that doesn't exist", () => {
    return request(app)
      .post(`/api/articles/32435/comments`)
      .send({
        username: "icellusedkars",
        body: "This is maafi!",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });

  test("400: Missing a field when posting a comment", () => {
    const article_id = 2;

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send({ body: "This is a test comment." })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("404: username doesnt exist when posting a comment", () => {
    const article_id = 2;

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send({ username: "user doesnt exists", body: "This is awesome!" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});

describe("Patch /api/articles/:article_id", () => {
  test("201: should respond with the updated article", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .expect(201)
      .send({
        inc_votes: 10,
      })
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(110);
      });
  });
  test("201: should respond with the updated article, ignoring additional properties", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .expect(201)
      .send({
        inc_votes: 10,
        body: "This is quite hard",
      })
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(110);
        expect(article.body).toBe("I find this existence challenging");
      });
  });
});

describe("ERROR: Patch /api/articles/:article_id", () => {
  test("400: responds with an error message when passed a bad request", () => {
    const article_id = "invalid_type";
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: responds with an error message post body is missing property", () => {
    const article_id = "invalid_type";
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .expect(400)
      .send({ body: "this is interesting" })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("404: responds with an error message when changing a article which is non-existent", () => {
    const article_id = 999;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({
        inc_votes: 10,
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});

describe("Delete /api/comments/:comment_id", () => {
  test("204: should respond with the deleted comment", () => {
    return request(app).delete(`/api/comments/2`).expect(204);
  });
});

describe("ERROR: DELETE /api/comments/:comment_id ", () => {
  test("400: responds with an error message when passed a bad request", () => {
    const comment_id = "invalid_type";
    return request(app).delete(`/api/comments/${comment_id}`).expect(400);
  }),
    test("404: responds with valid comment but no resoure found", () => {
      const comment_id = 9999;
      return request(app).delete(`/api/comments/${comment_id}`).expect(404);
    });
});

describe("GET /api/users", () => {
  test("status: 200, should respond with user array of objects ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
