import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProductDetailsPage } from "../ProductDetailsPage";
import "../../i18n/config";

vi.mock("convex/react", () => ({
  useQuery: vi.fn().mockReturnValue({
    _id: "prod1",
    slug: "5l-canister",
    name: "5L Canister",
    description: "High density polyethylene canister",
    specs: { capacity: "5L" },
    certifications: ["UN Approved"],
    useCases: ["Agrochemicals"],
    images: ["img1.jpg", "img2.jpg"],
    categorySlug: "containers",
  }),
}));

vi.mock("gsap", () => ({
  default: {
    to: (_target: unknown, vars: { onComplete?: () => void }) => {
      vars.onComplete?.();
    },
    set: vi.fn(),
    context: () => ({ revert: vi.fn() }),
  },
}));

beforeEach(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

describe("ProductDetailsPage image gallery accessibility", () => {
  it("sets aria-current on the active thumbnail button and updates on click", () => {
    render(
      <MemoryRouter initialEntries={["/products/5l-canister"]}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    const thumbButtons = screen.getAllByRole("button", { name: /5L Canister, image/i });
    expect(thumbButtons).toHaveLength(2);

    expect(thumbButtons[0]).toHaveAttribute("aria-current", "true");
    expect(thumbButtons[1]).not.toHaveAttribute("aria-current");

    fireEvent.click(thumbButtons[1]);

    expect(thumbButtons[0]).not.toHaveAttribute("aria-current");
    expect(thumbButtons[1]).toHaveAttribute("aria-current", "true");
  });

  it("includes focus-visible ring styles on thumbnail buttons", () => {
    render(
      <MemoryRouter initialEntries={["/products/5l-canister"]}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    const thumbButton = screen.getAllByRole("button", { name: /5L Canister, image/i })[0];
    expect(thumbButton.className).toContain("focus-visible:ring-2");
    expect(thumbButton.className).toContain("focus-visible:ring-secondary");
  });
});
