import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { AdminLayout } from "../../../admin/components/AdminLayout";
import "../../../i18n/config";

vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({
    user: {
      firstName: "Admin",
      fullName: "Admin User",
      primaryEmailAddress: { emailAddress: "admin@example.com" },
    },
  }),
  SignOutButton: ({ children }: { children: React.ReactNode }) => children,
}));

function renderWithRouter(ui: React.ReactNode, initialPath = "/") {
  return render(<MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>);
}

function mockMobileViewport(matches: boolean) {
  const mediaQueryList = {
    matches,
    media: "(max-width: 767px)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mediaQueryList));
}

describe("layout navigation accessibility", () => {
  beforeEach(() => {
    mockMobileViewport(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("removes the closed public mobile menu from the focus order", () => {
    renderWithRouter(<Header />);

    const mobileNav = screen.getByTestId("mobile-nav-panel");

    expect(mobileNav).toHaveAttribute("aria-hidden", "true");
    expect(mobileNav).toHaveAttribute("inert");
  });

  it("removes the closed admin mobile sidebar from the focus order", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Admin content</p>
      </AdminLayout>,
      "/admin/products"
    );

    const sidebar = screen.getByTestId("admin-sidebar");

    expect(sidebar).toHaveAttribute("aria-hidden", "true");
    expect(sidebar).toHaveAttribute("inert");
  });

  it("keeps desktop admin sidebar interactive when the mobile drawer state is closed", () => {
    mockMobileViewport(false);

    renderWithRouter(
      <AdminLayout>
        <p>Admin content</p>
      </AdminLayout>,
      "/admin/products"
    );

    const sidebar = screen.getByTestId("admin-sidebar");

    expect(sidebar).not.toHaveAttribute("inert");
    expect(sidebar).not.toHaveAttribute("aria-hidden");
  });

  it("does not use sub-AA white opacity text on dark layout chrome", () => {
    const rendered = [
      renderWithRouter(<Header />).container,
      renderWithRouter(<Footer />).container,
      renderWithRouter(
        <AdminLayout>
          <p>Admin content</p>
        </AdminLayout>,
        "/admin/products"
      ).container,
    ];
    const lowContrastWhite = /text-white\/(?:20|25|30|35|40|45)\b/g;
    const matches = rendered.flatMap((container) =>
      [...container.querySelectorAll("[class]")].flatMap((element) =>
        [...(element.getAttribute("class") ?? "").matchAll(lowContrastWhite)].map((match) => match[0])
      )
    );

    expect(matches).toEqual([]);
  });
});
