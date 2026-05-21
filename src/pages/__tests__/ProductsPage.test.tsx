import { render, screen, fireEvent } from "@testing-library/react";
import { ProductsPage } from "../ProductsPage";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

// Mock Convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

describe("ProductsPage Search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input with shortcut hint", () => {
    render(
      <BrowserRouter>
        <ProductsPage />
      </BrowserRouter>
    );

    const input = screen.getByLabelText("products.searchPlaceholder");
    expect(input).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
  });

  it("focuses input when '/' is pressed", () => {
    render(
      <BrowserRouter>
        <ProductsPage />
      </BrowserRouter>
    );

    const input = screen.getByLabelText("products.searchPlaceholder");
    fireEvent.keyDown(window, { key: "/" });

    expect(document.activeElement).toBe(input);
  });

  it("shows clear button when text is entered", () => {
    render(
      <BrowserRouter>
        <ProductsPage />
      </BrowserRouter>
    );

    const input = screen.getByLabelText("products.searchPlaceholder") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test" } });

    const clearButton = screen.getByLabelText("products.searchClear");
    expect(clearButton).toBeInTheDocument();
    expect(screen.queryByText("/")).not.toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(input.value).toBe("");
  });
});
