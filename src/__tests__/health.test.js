const request = require("supertest");
const app = require("../app");

describe("Health Check Endpoint", () => {
  it("GET /api/health debería retornar estado OK", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("timestamp");
  });
});
