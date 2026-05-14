import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders as a button element by default", () => {
    render(<Button>Submit</Button>);
    const btn = screen.getByRole("button", { name: /submit/i });
    expect(btn.tagName).toBe("BUTTON");
  });

  it("renders as an anchor when href is provided", () => {
    render(<Button as="a" href="/test">Link</Button>);
    const link = screen.getByText("Link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/test");
  });

  it("applies primary variant styles", () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-primary");
    expect(btn.className).toContain("text-on-primary");
  });

  it("applies secondary variant styles", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-surface");
    expect(btn.className).toContain("text-on-surface");
  });

  it("fires onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Press</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("adds rel attribute for external links", () => {
    render(<Button as="a" href="https://example.com">External</Button>);
    const link = screen.getByText("External");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not add rel for internal links", () => {
    render(<Button as="a" href="/internal">Internal</Button>);
    const link = screen.getByText("Internal");
    expect(link).not.toHaveAttribute("rel");
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toContain("text-xs");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button").className).toContain("text-button-label");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("text-button-label");
  });
});
