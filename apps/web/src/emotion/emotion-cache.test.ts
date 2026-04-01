import createCache from "@emotion/cache";
import { describe, expect, it, vi } from "vitest";
import { createEmotionCache } from "./emotion-cache";

vi.mock("@emotion/cache", () => ({
  default: vi.fn(() => ({ key: "css", sheet: {}, inserted: {} })),
}));

describe("createEmotionCache", () => {
  it("calls createCache with key 'css'", () => {
    createEmotionCache();
    expect(createCache).toHaveBeenCalledWith({ key: "css" });
  });

  it("returns the cache object from createCache", () => {
    const result = createEmotionCache();
    expect(result).toEqual({ key: "css", sheet: {}, inserted: {} });
  });
});
