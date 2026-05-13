import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Certified</Badge>);
    expect(screen.getByText("Certified")).toBeInTheDocument();
  });

  it("applies outline variant by default", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("bg-surface");
    expect(badge.className).toContain("border-outline-variant");
  });

  it("applies secondary variant styles", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText("Secondary");
    expect(badge.className).toContain("bg-secondary");
    expect(badge.className).toContain("text-on-secondary");
  });

  it("applies outline variant styles", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge.className).toContain("border-outline");
  });

  it("merges custom className", () => {
    render(<Badge className="custom-class">Styled</Badge>);
    expect(screen.getByText("Styled").className).toContain("custom-class");
  });
});
