import type { EmotionCache } from "@emotion/cache";
import { render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ClientCacheProvider, useInjectStyles } from "./emotion-client";

describe("ClientCacheProvider", () => {
  it("renders children", () => {
    render(
      <ClientCacheProvider>
        <div data-testid="child">Hello</div>
      </ClientCacheProvider>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByText("Hello")).toBeDefined();
  });
});

describe("useInjectStyles", () => {
  it("flushes cache and re-inserts tags on mount", () => {
    const mockInsertTag = vi.fn();
    const mockFlush = vi.fn();
    const mockTag = document.createElement("style");

    const mockCache = {
      sheet: {
        container: null as Node | null,
        tags: [mockTag],
        flush: mockFlush,
        _insertTag: mockInsertTag,
      },
    } as unknown as EmotionCache;

    const TestComponent = () => {
      useInjectStyles(mockCache);
      return <div data-testid="test">test</div>;
    };

    render(
      <StrictMode>
        <ClientCacheProvider>
          <TestComponent />
        </ClientCacheProvider>
      </StrictMode>,
    );

    expect(screen.getByTestId("test")).toBeDefined();
    expect(mockCache.sheet.container).toBe(document.head);
    expect(mockFlush).toHaveBeenCalled();
    expect(mockInsertTag).toHaveBeenCalledWith(mockTag);
  });
});
