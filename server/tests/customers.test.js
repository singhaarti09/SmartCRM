const request = require("supertest");
const app = require("../src/app");

describe("SmartCRM customer API", () => {
  test("returns customer records", async () => {
    const response = await request(app).get("/api/customers");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(5);
  });

  test("filters customers by search term", async () => {
    const response = await request(app).get("/api/customers?search=priya");

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0].name).toBe("Priya Sharma");
  });

  test("returns 404 for an unknown customer", async () => {
    const response = await request(app).get("/api/customers/999");

    expect(response.statusCode).toBe(404);
  });

  test("health endpoint works", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
