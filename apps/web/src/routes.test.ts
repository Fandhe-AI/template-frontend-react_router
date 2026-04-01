import { describe, expect, it } from "vitest";
import routes from "./routes";

describe("routes", () => {
  it("is an array", () => {
    expect(Array.isArray(routes)).toBe(true);
  });

  it("has an index route pointing to routes/home.tsx", () => {
    const indexRoute = routes[0];
    expect(indexRoute).toBeDefined();
    expect(indexRoute).toMatchObject({
      file: "routes/home.tsx",
      index: true,
    });
  });
});
