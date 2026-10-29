import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProductDetailsPage } from "../ProductDetailsPage";
import "../../i18n/config";

const mockProduct = {
  _id: "1",
  slug: "test-product",
  name: "Test Container 5L",
  description: "A durable plastic container",
  categorySlug: "containers",
  category: "Containers",
  images: ["img1.jpg", "img2.jpg", "img3.jpg"],
  specs: { material: "HDPE", capacity: "5L" },
  certifications: ["ISO 9001"],
  useCases: ["Agrochemicals"],
};

vi.mock("convex/react", () => ({
  useQuery: () => mockProduct,
}));

vi.mock("gsap", () => ({
  default: {
    context: (cb: () => void) => {
      cb();
      return { revert: vi.fn() };
    },
    fromTo: vi.fn(),
    set: vi.fn(),
    to: (_target: unknown, vars: { onComplete?: () => void }) => {
      vars.onComplete?.();
    },
    quickTo: () => vi.fn(),
    ticker: { add: vi.fn(), remove: vi.fn() },
  },
}));

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

function renderWithRouter(initialSlug = "test-product") {
  return render(
    <MemoryRouter initialEntries={[`/products/${initialSlug}`]}>
      <Routes>
        <Route path="/products/:slug" element={<ProductDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProductDetailsPage Gallery Accessibility", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders gallery thumbnails with type='button', focus-visible styles, and aria-current on active thumbnail", () => {
    renderWithRouter();

    const thumbnails = screen.getAllByRole("button", { name: /Test Container 5L, image/i });
    expect(thumbnails).toHaveLength(3);

    // Check first thumbnail (initially active)
    expect(thumbnails[0]).toHaveAttribute("type", "button");
    expect(thumbnails[0]).toHaveAttribute("aria-current", "true");
    expect(thumbnails[0].className).toContain("focus-visible:ring-secondary");

    // Check second thumbnail (inactive)
    expect(thumbnails[1]).toHaveAttribute("type", "button");
    expect(thumbnails[1]).not.toHaveAttribute("aria-current");
    expect(thumbnails[1].className).toContain("focus-visible:ring-secondary");

    // Click second thumbnail and verify active state shifts
    fireEvent.click(thumbnails[1]);

    expect(thumbnails[0]).not.toHaveAttribute("aria-current");
    expect(thumbnails[1]).toHaveAttribute("aria-current", "true");
  });
});
