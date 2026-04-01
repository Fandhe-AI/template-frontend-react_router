import type { EntryContext } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("./emotion/emotion-server", () => ({
  createEmotion: () => ({
    renderToString: () => "<html><body>mocked</body></html>",
    injectStyles: (html: string) => html,
  }),
}));

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    ServerRouter: () => null,
  };
});

describe("handleRequest", () => {
  it("returns a Response with text/html content type", async () => {
    const { default: handleRequest } = await import("./entry.server");

    const request = new Request("http://localhost/test");
    const headers = new Headers();
    const routerContext = {} as EntryContext;

    const response = handleRequest(request, 200, headers, routerContext);

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("Content-Type")).toBe("text/html");
  });

  it("uses the provided status code", async () => {
    const { default: handleRequest } = await import("./entry.server");

    const request = new Request("http://localhost/test");
    const headers = new Headers();
    const routerContext = {} as EntryContext;

    const response = handleRequest(request, 404, headers, routerContext);

    expect(response.status).toBe(404);
  });

  it("returns HTML body starting with <!DOCTYPE html>", async () => {
    const { default: handleRequest } = await import("./entry.server");

    const request = new Request("http://localhost/test");
    const headers = new Headers();
    const routerContext = {} as EntryContext;

    const response = handleRequest(request, 200, headers, routerContext);
    const body = await response.text();

    expect(body).toMatch(/^<!DOCTYPE html>/);
  });
});
