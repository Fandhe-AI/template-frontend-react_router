import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ColorModeProvider, useColorMode } from "./color-mode";

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
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

function TestConsumer() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <div>
      <span data-testid="color-mode">{colorMode}</span>
      <button type="button" onClick={toggleColorMode}>
        toggle
      </button>
    </div>
  );
}

describe("useColorMode", () => {
  it("returns the current color mode", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <TestConsumer />
      </ChakraProvider>,
    );
    expect(screen.getByTestId("color-mode").textContent).toBe("light");
  });
});
