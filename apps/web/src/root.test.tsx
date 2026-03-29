import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App, { ErrorBoundary, Layout, links } from "./root";

vi.mock("react-router", () => ({
  Links: () => <div data-testid="links" />,
  Meta: () => <div data-testid="meta" />,
  Outlet: () => <div data-testid="outlet" />,
  Scripts: () => <div data-testid="scripts" />,
  ScrollRestoration: () => <div data-testid="scroll-restoration" />,
  isRouteErrorResponse: (
    error: unknown,
  ): error is { status: number; statusText?: string } =>
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as Record<string, unknown>).status === "number",
}));

describe("links", () => {
  it("returns preconnect and stylesheet links", () => {
    const result = links();
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    });
    expect(result[1]).toMatchObject({
      rel: "preconnect",
      crossOrigin: "anonymous",
    });
    expect(result[2]).toMatchObject({ rel: "stylesheet" });
  });
});

describe("Layout", () => {
  it("renders children", () => {
    render(
      <Layout>
        <div data-testid="child">Hello</div>
      </Layout>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });
});

describe("App", () => {
  it("renders Outlet", () => {
    render(<App />);
    expect(screen.getByTestId("outlet")).toBeDefined();
  });
});

describe("ErrorBoundary", () => {
  const params = {};

  it("shows 404 message for a 404 route error", () => {
    render(
      <ErrorBoundary
        params={params}
        error={{ status: 404, statusText: "Not Found", data: null }}
      />,
    );
    expect(screen.getByText("404")).toBeDefined();
    expect(
      screen.getByText("The requested page could not be found."),
    ).toBeDefined();
  });

  it("shows statusText for a non-404 route error with statusText", () => {
    render(
      <ErrorBoundary
        params={params}
        error={{ status: 500, statusText: "Internal Server Error", data: null }}
      />,
    );
    expect(screen.getByText("Error")).toBeDefined();
    expect(screen.getByText("Internal Server Error")).toBeDefined();
  });

  it("shows default message for a non-404 route error without statusText", () => {
    render(
      <ErrorBoundary
        params={params}
        error={{ status: 500, statusText: "", data: null }}
      />,
    );
    expect(screen.getByText("Error")).toBeDefined();
    expect(screen.getByText("An unexpected error occurred.")).toBeDefined();
  });

  it("shows error details and stack in DEV mode", () => {
    const error = new Error("Something broke");
    error.stack = "Error: Something broke\n    at test";
    render(<ErrorBoundary params={params} error={error} />);
    expect(screen.getByText("Something broke")).toBeDefined();
    expect(screen.getByText(/Error: Something broke/)).toBeDefined();
  });

  it("shows default message for non-Error in DEV mode", () => {
    render(
      <ErrorBoundary
        params={params}
        error={"string error" as unknown as Error}
      />,
    );
    expect(screen.getByText("Oops!")).toBeDefined();
    expect(screen.getByText("An unexpected error occurred.")).toBeDefined();
  });
});
