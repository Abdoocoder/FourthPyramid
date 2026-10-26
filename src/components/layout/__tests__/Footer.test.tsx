import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Footer } from "../Footer";
import "../../../i18n/config";

function renderWithRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Footer component", () => {
  beforeEach(() => {
    window.scrollY = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders BackToTop button with appropriate aria-label and hidden state when at top of page", () => {
    renderWithRouter(<Footer />);

    const backToTopBtn = screen.getByRole("button", { hidden: true });
    expect(backToTopBtn).toHaveAttribute("aria-hidden", "true");
    expect(backToTopBtn).toHaveAttribute("tabIndex", "-1");
    expect(backToTopBtn.className).toContain("focus-visible:ring-primary");
  });

  it("becomes visible and focusable on scroll with focus-visible styles", () => {
    renderWithRouter(<Footer />);

    act(() => {
      window.scrollY = 500;
      fireEvent.scroll(window);
    });

    const backToTopBtn = screen.getByRole("button");
    expect(backToTopBtn).toHaveAttribute("aria-hidden", "false");
    expect(backToTopBtn).toHaveAttribute("tabIndex", "0");
    expect(backToTopBtn.className).toContain("focus-visible:ring-2");
    expect(backToTopBtn.className).toContain("focus-visible:ring-primary");
  });
});
