import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProductDetailsPage } from "../ProductDetailsPage";

vi.mock("i18next", () => ({
  default: {
    language: "en",
    changeLanguage: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "en",
      changeLanguage: vi.fn(),
    },
  }),
}));

vi.mock("convex/react", () => ({
  useQuery: () => ({
    _id: "prod-1",
    slug: "jerrycan-20l",
    name: "20L Heavy Duty Jerrycan",
    description: "High density polyethylene container.",
    categorySlug: "containers",
    category: "Containers",
    images: ["img1.jpg", "img2.jpg"],
    specs: { material: "HDPE", capacity: "20L" },
    certifications: ["UN Approved", "ISO 9001"],
    useCases: ["Agrochemicals"],
  }),
}));

describe("ProductDetailsPage Thumbnail Gallery", () => {
  it("marks active thumbnail with aria-current='true' and includes focus ring classes", () => {
    render(
      <MemoryRouter initialEntries={["/products/jerrycan-20l"]}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    const thumb1 = screen.getByRole("button", { name: "20L Heavy Duty Jerrycan, image 1" });
    const thumb2 = screen.getByRole("button", { name: "20L Heavy Duty Jerrycan, image 2" });

    expect(thumb1).toHaveAttribute("aria-current", "true");
    expect(thumb2).not.toHaveAttribute("aria-current");

    expect(thumb1.className).toContain("focus-visible:ring-2");
    expect(thumb1.className).toContain("focus-visible:ring-secondary");
  });
});
