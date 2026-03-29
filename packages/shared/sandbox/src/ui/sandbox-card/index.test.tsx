import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SandboxCard } from ".";

describe("SandboxCard", () => {
  it("renders the title and description", () => {
    render(<SandboxCard title="Test" description="A test card" />);
    expect(screen.getByText("Test")).toBeDefined();
    expect(screen.getByText("A test card")).toBeDefined();
  });
});
