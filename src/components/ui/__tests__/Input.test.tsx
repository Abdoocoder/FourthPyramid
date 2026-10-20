import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input, Textarea, Select } from "../Input";

describe("Input component accessibility", () => {
  it("renders Input with aria-required when required is true", () => {
    render(<Input id="test-input" label="Test Label" required />);
    const input = screen.getByLabelText(/Test Label/i);
    expect(input).toHaveAttribute("id", "test-input");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("renders Input without aria-required when required is false or omitted", () => {
    render(<Input id="test-input" label="Test Label" />);
    const input = screen.getByLabelText(/Test Label/i);
    expect(input).not.toHaveAttribute("aria-required");
  });

  it("renders Textarea with aria-required when required is true", () => {
    render(<Textarea id="test-textarea" label="Message" required />);
    const textarea = screen.getByLabelText(/Message/i);
    expect(textarea).toHaveAttribute("aria-required", "true");
  });

  it("renders Select with aria-required when required is true", () => {
    render(
      <Select id="test-select" label="Option" required>
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByLabelText(/Option/i);
    expect(select).toHaveAttribute("aria-required", "true");
  });
});
