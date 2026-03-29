import { describe, expect, it } from "vitest";
import { greet } from "./greet";

describe("greet", () => {
  it("returns a greeting with the default prefix", () => {
    expect(greet({ name: "World" })).toBe("Hello, World!");
  });

  it("returns a greeting with a custom prefix", () => {
    expect(greet({ name: "Portal", greeting: "Welcome to" })).toBe(
      "Welcome to, Portal!",
    );
  });
});
