const request = require("supertest");
const server = require("../api/server");
const db = require("../data/dbConfig");

test("Correct environment", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("[GET] /api/jokes", () => {
  test("Responds status 400", async () => {
    const res = await request(server).get("/api/jokes");

    expect(res.status).toBe(400);
  });
  test("Responds with 'token required' if no token is provided", async () => {
    const res = await request(server).get("/api/jokes");

    expect(res.body).toBe("token required");
  });
});

describe("[POST] /api/auth/register", () => {
  test("Responds with 400 on falsey values", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "ricardo2", password: "" });

    expect(res.body).toBe("username and password required");
  });

  test("Responds with 201 on success", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "ricardo2", password: "123" });

    expect(res.status).toBe(201);
  });
});

describe("[POST] /api/auth/login", () => {
  test("Responds with 400 on falsey values", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "ricardo", password: "" });

    expect(res.body).toBe("username and password required");
  });

  test("Responds with 201 on success", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "ricardo", password: "123" });

    expect(res.status).toBe(200);
  });
});
