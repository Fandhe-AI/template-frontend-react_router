import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ColorModeButton,
  ColorModeIcon,
  ColorModeProvider,
  DarkMode,
  LightMode,
  useColorMode,
  useColorModeValue,
} from "./color-mode";

const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn(() => ({
  resolvedTheme: "light" as string | undefined,
  setTheme: mockSetTheme,
  forcedTheme: undefined as string | undefined,
}));

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  useTheme: () => mockUseTheme(),
}));

vi.mock("react-icons/lu", () => ({
  LuMoon: () => <span data-testid="moon-icon" />,
  LuSun: () => <span data-testid="sun-icon" />,
}));

vi.mock("@chakra-ui/react", () => ({
  ClientOnly: ({ children }: { children: ReactNode }) => <>{children}</>,
  IconButton: (props: Record<string, unknown>) => (
    <button
      type="button"
      onClick={props.onClick as () => void}
      aria-label={props["aria-label"] as string}
    >
      {props.children as ReactNode}
    </button>
  ),
  Skeleton: () => <div data-testid="skeleton" />,
  Span: (props: Record<string, unknown>) => (
    <span className={props.className as string}>
      {props.children as ReactNode}
    </span>
  ),
}));

beforeEach(() => {
  mockSetTheme.mockClear();
  mockUseTheme.mockReturnValue({
    resolvedTheme: "light",
    setTheme: mockSetTheme,
    forcedTheme: undefined,
  });
});

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

describe("useColorMode", () => {
  it("returns the current color mode", () => {
    const Consumer = () => {
      const { colorMode } = useColorMode();
      return <span data-testid="mode">{colorMode}</span>;
    };
    render(<Consumer />);
    expect(screen.getByTestId("mode").textContent).toBe("light");
  });

  it("uses forcedTheme when present", () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: "light",
      setTheme: mockSetTheme,
      forcedTheme: "dark",
    });
    const Consumer = () => {
      const { colorMode } = useColorMode();
      return <span data-testid="mode">{colorMode}</span>;
    };
    render(<Consumer />);
    expect(screen.getByTestId("mode").textContent).toBe("dark");
  });

  it("toggleColorMode switches from dark to light", () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: "dark",
      setTheme: mockSetTheme,
      forcedTheme: undefined,
    });
    const Consumer = () => {
      const { toggleColorMode } = useColorMode();
      return (
        <button type="button" onClick={toggleColorMode} data-testid="toggle" />
      );
    };
    render(<Consumer />);
    fireEvent.click(screen.getByTestId("toggle"));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});

describe("useColorModeValue", () => {
  it("returns light value in light mode", () => {
    const Consumer = () => {
      const val = useColorModeValue("light-val", "dark-val");
      return <span data-testid="val">{val}</span>;
    };
    render(<Consumer />);
    expect(screen.getByTestId("val").textContent).toBe("light-val");
  });

  it("returns dark value in dark mode", () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: "dark",
      setTheme: mockSetTheme,
      forcedTheme: undefined,
    });
    const Consumer = () => {
      const val = useColorModeValue("light-val", "dark-val");
      return <span data-testid="val">{val}</span>;
    };
    render(<Consumer />);
    expect(screen.getByTestId("val").textContent).toBe("dark-val");
  });
});

describe("ColorModeIcon", () => {
  it("renders sun icon in light mode", () => {
    render(<ColorModeIcon />);
    expect(screen.getByTestId("sun-icon")).toBeDefined();
  });

  it("renders moon icon in dark mode", () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: "dark",
      setTheme: mockSetTheme,
      forcedTheme: undefined,
    });
    render(<ColorModeIcon />);
    expect(screen.getByTestId("moon-icon")).toBeDefined();
  });
});

describe("ColorModeButton", () => {
  it("renders and toggles color mode on click", () => {
    render(<ColorModeButton />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});

describe("LightMode", () => {
  it("renders children", () => {
    render(<LightMode>content</LightMode>);
    expect(screen.getByText("content")).toBeDefined();
  });
});

describe("DarkMode", () => {
  it("renders children", () => {
    render(<DarkMode>content</DarkMode>);
    expect(screen.getByText("content")).toBeDefined();
  });
});
