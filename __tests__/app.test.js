const request = require("supertest");
const app = require("../ExpressApp/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const topics = require("../db/data/test-data/topics");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("API", () => {
  test("200: GET /api/healthcheck response with an okay message", () => {
    return request(app).get("/api/healthcheck").expect(200);
  });

  test("404: GET /api/banana should return not found", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .expect({ msg: "Not Found" });
  });
});

describe("/api/topics", () => {
  test("200: GET /api/topics should respond with all available topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api", () => {
  test("200: GET /api should respond with an object providing a brief description of all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const keys = Object.keys(body.endpoints);
        expect(body.endpoints[keys[0]]).toMatchObject({
          description: expect.any(String),
        });
        for (let i = 1; i < keys.length; i++) {
          expect(body.endpoints[keys[i]]).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Object),
            exampleResponse: expect.any(Object),
          });
        }
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("200: GET /api/articles/:article_id should return the correct object from the id given", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.article[0]).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: GET /api/articles/:article_id should return Not Found if passed an id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/9876")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: GET /api/articles/:article_id should return Bad Request if passed an id that is not a number", () => {
    return request(app)
      .get("/api/articles/hi")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/articles", () => {
  test("200: GET /api/articles should return an array of article objects with correct keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThanOrEqual(5);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: GET /api/articles should be sorted in descending order by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("200: GET /api/articles/:article_id/comments should return all comments for an article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBeGreaterThanOrEqual(11);
        body.comments.forEach((body) => {
          expect(body).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("200: GET /api/articles/:article_id/comments should be sorted by date created in descending order (most recent first)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: GET /api/articles/:article_id/comments should still return 200 with an empty array if the article exists, but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("404: GET /api/articles/:article_id/comments should return Not Found if the article_id passed does not exist", () => {
    return request(app)
      .get("/api/articles/19/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: GET /api/articles/hi/comments should return Bad Request if the id passed is not a valid id", () => {
    return request(app)
      .get("/api/articles/hi/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: POST /api/articles/:article_id/comments should respond with 201 and the posted comment", () => {
    const comment = { username: "lurker", comment: "some comment text" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment[0]).toMatchObject({
          comment_id: 19,
          body: expect.any(String),
          article_id: 3,
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("404: POST /api/articles/:article_id/comments should respond with Not Found if the username provided is not a valid username", () => {
    const comment = { username: "testUser", comment: "some comment text" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: POST /api/articles/:article_id/comments should response with Bad Request if the comment provided is not a string", () => {
    const comment = { username: "lurker", comment: 12 };
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: POST /api/articles/:article_id/comments should respond with Not Found if the article_id passed does not exist", () => {
    const comment = { username: "lurker", comment: "some comment text" };
    return request(app)
      .post("/api/articles/29/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: POST /api/articles/:article_id/comments should respond with Bad Request if no username or comment is passed", () => {
    const comment = {};
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: DELETE /api/comments/:comment_id should respond with 204 when a comment is successfully deleted", () => {
    return request(app)
      .delete("/api/comments/4")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: DELETE /api/comments/:comment_id should respond with Not Found if the comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/123987")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: DELETE /api/comments/:comment_id should respond with Bad Request if the comment_id passed is not a number", () => {
    return request(app)
      .delete("/api/comments/hi")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: PATCH /api/articles/:article_id should respond with an updated article with votes increased/decreased by provided value", () => {
    const votes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/4")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(5);
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: Should return Not Found if article_id passed does not exist", () => {
    const votes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/123")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: Should return Bad Request if passed votes is not a number", () => {
    const votes = { inc_votes: "hello" };
    return request(app)
      .patch("/api/articles/4")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return bad request if the property in the passed array is not called inc_votes", () => {
    const votes = { number: 12 };
    return request(app)
      .patch("/api/articles/4")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return bad request if the passed object is empty", () => {
    const votes = {};
    return request(app)
      .patch("/api/articles/4")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
