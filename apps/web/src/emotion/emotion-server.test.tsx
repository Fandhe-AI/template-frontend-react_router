import { describe, expect, it } from "vitest";
import { createEmotion } from "./emotion-server";

describe("createEmotion", () => {
  it("returns an object with cache, injectStyles, and renderToString", () => {
    const emotion = createEmotion();
    expect(emotion).toHaveProperty("cache");
    expect(emotion).toHaveProperty("injectStyles");
    expect(emotion).toHaveProperty("renderToString");
    expect(typeof emotion.injectStyles).toBe("function");
    expect(typeof emotion.renderToString).toBe("function");
  });

  it("cache has key 'css'", () => {
    const { cache } = createEmotion();
    expect(cache.key).toBe("css");
  });

  describe("injectStyles", () => {
    it("inserts styles after emotion-insertion-point meta tag", () => {
      const { injectStyles, renderToString } = createEmotion();
      const html = renderToString(<div>test</div>);
      const inputHtml = `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${html}`;
      const result = injectStyles(inputHtml);
      expect(result).toContain(
        '<meta name="emotion-insertion-point" content="emotion-insertion-point"/>',
      );
    });

    it("returns html unchanged when no emotion-insertion-point exists", () => {
      const { injectStyles } = createEmotion();
      const html = "<html><body>hello</body></html>";
      const result = injectStyles(html);
      expect(result).toBe(html);
    });
  });

  describe("renderToString", () => {
    it("converts a React element to an HTML string", () => {
      const { renderToString } = createEmotion();
      const result = renderToString(<div>hello</div>);
      expect(result).toContain("hello");
      expect(result).toContain("<div");
    });
  });
});
