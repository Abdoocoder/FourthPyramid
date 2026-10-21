import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductDetailsPage } from "../ProductDetailsPage";
import { useQuery } from "convex/react";
import "../../i18n/config";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ slug: "20l-jerrycan" }),
  };
});

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe("ProductDetailsPage accessibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  it("renders image gallery thumbnails with aria-current and focus-visible ring styles", () => {
    vi.mocked(useQuery).mockReturnValue({
      _id: "prod-1",
      slug: "20l-jerrycan",
      name: "20L Jerrycan",
      description: "Durable HDPE Jerrycan",
      categorySlug: "jerrycans",
      category: "Jerrycans",
      images: ["img1.jpg", "img2.jpg", "img3.jpg"],
      specs: { capacity: "20L", material: "HDPE" },
      certifications: ["UN Approved"],
      useCases: ["Chemicals"],
    });

    render(
      <MemoryRouter>
        <ProductDetailsPage />
      </MemoryRouter>
    );

    const thumb1 = screen.getByRole("button", { name: "20L Jerrycan, image 1" });
    const thumb2 = screen.getByRole("button", { name: "20L Jerrycan, image 2" });
    const thumb3 = screen.getByRole("button", { name: "20L Jerrycan, image 3" });

    expect(thumb1).toHaveAttribute("aria-current", "true");
    expect(thumb2).not.toHaveAttribute("aria-current");
    expect(thumb3).not.toHaveAttribute("aria-current");

    expect(thumb1.className).toContain("focus-visible:ring-2");
    expect(thumb1.className).toContain("focus-visible:ring-secondary");
  });
});
