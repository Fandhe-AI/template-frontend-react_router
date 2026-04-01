// @vitest-environment node

import type { EmotionCache } from "@emotion/cache";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ClientCacheProvider, useInjectStyles } from "./emotion-client";

describe("emotion-client SSR", () => {
  it("useInjectStyles is a no-op in server environment", () => {
    const mockFlush = vi.fn();
    const mockCache = {
      sheet: {
        container: null,
        tags: [],
        flush: mockFlush,
        _insertTag: vi.fn(),
      },
    } as unknown as EmotionCache;

    const TestComponent = () => {
      useInjectStyles(mockCache);
      return createElement("div", null, "ssr-test");
    };

    const html = renderToString(
      createElement(ClientCacheProvider, null, createElement(TestComponent)),
    );

    expect(html).toContain("ssr-test");
    expect(mockFlush).not.toHaveBeenCalled();
  });
});
