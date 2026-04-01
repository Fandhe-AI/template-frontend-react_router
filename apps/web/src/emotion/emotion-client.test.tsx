import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClientCacheProvider } from "./emotion-client";

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
