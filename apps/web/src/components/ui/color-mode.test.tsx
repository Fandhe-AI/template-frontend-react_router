import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ColorModeProvider, useColorMode } from "./color-mode";

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  useTheme: () => ({
    resolvedTheme: "light",
    setTheme: vi.fn(),
    forcedTheme: undefined,
  }),
}));

describe("ColorModeProvider", () => {
  it("renders children", () => {
    render(
      <ColorModeProvider>
        <div data-testid="child">Hello</div>
      </ColorModeProvider>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });
});

const TestConsumer = () => {
  const { colorMode } = useColorMode();
  return <span data-testid="color-mode">{colorMode}</span>;
};

describe("useColorMode", () => {
  it("returns the current color mode", () => {
    render(<TestConsumer />);
    expect(screen.getByTestId("color-mode").textContent).toBe("light");
  });
});
