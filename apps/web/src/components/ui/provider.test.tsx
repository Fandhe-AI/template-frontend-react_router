import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Provider } from "./provider";

vi.mock("./color-mode", () => ({
  ColorModeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="color-mode-provider">{children}</div>
  ),
}));

describe("Provider", () => {
  it("renders children", () => {
    render(
      <Provider>
        <div data-testid="child">Hello</div>
      </Provider>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByText("Hello")).toBeDefined();
  });
});
