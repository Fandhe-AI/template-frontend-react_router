import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockHydrateRoot = vi.fn();

vi.mock("react-dom/client", () => ({
  hydrateRoot: (...args: [Document, ReactNode]) => mockHydrateRoot(...args),
}));

vi.mock("react-router/dom", () => ({
  HydratedRouter: () => null,
}));

vi.mock("./emotion/emotion-client", () => ({
  ClientCacheProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@chakra-ui/react", () => ({
  ChakraProvider: ({ children }: { children: ReactNode }) => children,
  defaultSystem: {},
}));

describe("entry.client", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("calls hydrateRoot on document", async () => {
    await import("./entry.client");
    expect(mockHydrateRoot).toHaveBeenCalledWith(document, expect.any(Object));
  });
});
