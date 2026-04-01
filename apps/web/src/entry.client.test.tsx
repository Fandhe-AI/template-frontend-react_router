import { describe, expect, it, vi } from "vitest";

const mockHydrateRoot = vi.fn();

vi.mock("react-dom/client", () => ({
  hydrateRoot: (...args: [Document, React.ReactNode]) =>
    mockHydrateRoot(...args),
}));

vi.mock("react-router/dom", () => ({
  HydratedRouter: () => null,
}));

vi.mock("./emotion/emotion-client", () => ({
  ClientCacheProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock("@chakra-ui/react", () => ({
  ChakraProvider: ({ children }: { children: React.ReactNode }) => children,
  defaultSystem: {},
}));

describe("entry.client", () => {
  it("calls hydrateRoot on document", async () => {
    await import("./entry.client");
    expect(mockHydrateRoot).toHaveBeenCalledWith(document, expect.anything());
  });
});
