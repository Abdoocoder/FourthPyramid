import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductsPage } from "../ProductsPage";
import "../../i18n/config";

// Mock convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

// Mock animations
vi.mock("../../lib/animations", () => ({
  usePageEntrance: vi.fn(),
  useTiltCard: vi.fn(),
}));

describe("ProductsPage Search UX", () => {
  beforeEach(() => {
    // Mock matchMedia for GSAP/prefers-reduced-motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("focuses search input when '/' is pressed", () => {
    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/Search catalog/i);
    fireEvent.keyDown(window, { key: "/" });

    expect(document.activeElement).toBe(searchInput);
  });

  it("shows clear button when search has text and clears it on click", () => {
    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/Search catalog/i);

    fireEvent.change(searchInput, { target: { value: "test query" } });

    const clearButton = screen.getByLabelText(/Clear search/i);
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue("");
    expect(document.activeElement).toBe(searchInput);
  });

  it("shows keyboard shortcut hint when search is empty", () => {
    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("/")).toBeInTheDocument();
  });
});
