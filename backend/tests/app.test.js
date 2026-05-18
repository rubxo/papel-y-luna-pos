const request = require("supertest");
const createApp = require("../src/app");

describe("app", () => {
  it("responds at root", async () => {
    const app = createApp();
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("<!DOCTYPE html>");
  });
});
