const request = require("supertest");
const app = require("../ExpressApp/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const topics = require("../db/data/test-data/topics");

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
