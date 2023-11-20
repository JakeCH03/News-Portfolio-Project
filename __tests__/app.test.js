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
        expect(body.articles.length).toBe(5);
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
        expect(body.articles).toBeSortedBy("created_at",{
          descending: true,
        });
      });
  });
});
