import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home, { meta } from "./home";

describe("meta", () => {
  it("returns title and description", () => {
    const result = meta();
    expect(result).toEqual([
      { title: "Frontend Template" },
      { name: "description", content: "React Router + Chakra UI template" },
    ]);
  });
});

describe("Home", () => {
  it("renders heading", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Home />
      </ChakraProvider>,
    );
    expect(screen.getByText("Frontend Template")).toBeDefined();
  });
});
