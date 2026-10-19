import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductDetailsPage } from "../ProductDetailsPage";
import "../../i18n/config";

const mockProduct = {
  _id: "prod_1",
  name: "20L Heavy Duty Container",
  name_ar: "وعاء سعة 20 ليتر",
  slug: "20l-heavy-duty-container",
  category: "Containers",
  category_ar: "حاويات",
  categorySlug: "containers",
  description: "High density packaging container",
  description_ar: "وعاء تغليف عال الكثافة",
  images: [
    "https://res.cloudinary.com/demo/image/upload/sample1.jpg",
    "https://res.cloudinary.com/demo/image/upload/sample2.jpg",
  ],
  certifications: ["UN Certified"],
  certifications_ar: ["معتمد من الأمم المتحدة"],
  useCases: ["Agrochemicals"],
  useCases_ar: ["المواد الكيميائية الزراعية"],
  specs: { capacity: "20L" },
  specs_ar: { capacity: "20 ليتر" },
};

vi.mock("convex/react", () => ({
  useQuery: () => mockProduct,
}));

function renderWithRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("ProductDetailsPage thumbnail accessibility", () => {
  beforeEach(() => {
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("marks active image thumbnail with aria-current='true' and includes focus-visible ring styles", () => {
    renderWithRouter(<ProductDetailsPage />);

    const thumbButtons = screen.getAllByRole("button", { name: /20L Heavy Duty Container, image/i });
    expect(thumbButtons).toHaveLength(2);

    expect(thumbButtons[0]).toHaveAttribute("aria-current", "true");
    expect(thumbButtons[0].className).toContain("focus-visible:ring-2");
    expect(thumbButtons[0].className).toContain("focus-visible:ring-secondary");

    expect(thumbButtons[1]).not.toHaveAttribute("aria-current");
  });
});
