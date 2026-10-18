import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Footer } from "../Footer";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

describe("Footer component & BackToTop button", () => {
  beforeEach(() => {
    window.scrollY = 0;
  });

  it("renders the BackToTop button with appropriate accessibility attributes and focus-visible classes", () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const backToTopButton = container.querySelector('button[aria-label="footer.backToTop"]');
    expect(backToTopButton).not.toBeNull();
    expect(backToTopButton).toHaveAttribute("aria-hidden", "true");
    expect(backToTopButton).toHaveAttribute("tabIndex", "-1");
    expect(backToTopButton?.className).toContain("focus-visible:ring-2");
    expect(backToTopButton?.className).toContain("focus-visible:ring-primary");
  });

  it("becomes visible and interactive when scrolled past threshold", () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const backToTopButton = container.querySelector('button[aria-label="footer.backToTop"]');
    expect(backToTopButton).toHaveAttribute("aria-hidden", "true");

    // Simulate scroll past 400px
    window.scrollY = 450;
    fireEvent.scroll(window);

    expect(backToTopButton).toHaveAttribute("aria-hidden", "false");
    expect(backToTopButton).toHaveAttribute("tabIndex", "0");
  });
});
