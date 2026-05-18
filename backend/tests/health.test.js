const request = require("supertest");
const createApp = require("../src/app");

describe("health", () => {
  it("responds with ok", async () => {
    const app = createApp();
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe("ok");
    expect(["online", "offline"]).toContain(res.body.database);
  });
});
