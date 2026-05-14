import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, ArrowUpRight } from "lucide-react";
import { navLinks, siteConfig } from "../../lib/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState("");
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const toggleLang = () => i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 w-full z-50 bg-pyramid-navy transition-shadow duration-300"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-20 flex items-center gap-6">

        {/* Brand */}
        <Link
          to="/"
          aria-label={`${siteConfig.name} — ${t("nav.home")}`}
          className="flex items-center gap-3 shrink-0"
        >
          <img
            src="/logo.svg"
            alt={siteConfig.name}
            className="h-8 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <div className="hidden sm:flex flex-col leading-none gap-0.5">
            <span className="text-white text-[0.9375rem] font-bold tracking-tight">
              Fourth Pyramid
            </span>
            <span className="text-white/30 text-[0.5625rem] font-medium uppercase tracking-[0.18em]">
              Plastic Industries
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div
          className="hidden md:block h-6 w-px shrink-0"
          style={{ background: "rgba(255,255,255,0.1)" }}
          aria-hidden="true"
        />

        {/* Desktop nav */}
        <nav
          aria-label={t("nav.primary")}
          className="hidden md:flex items-center gap-0.5 flex-1"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center px-3 min-h-11 text-sm font-medium transition-colors duration-200 rounded-lg ${
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/85 hover:bg-white/5"
                }`}
                style={{ transitionTimingFunction: "var(--ease-out-strong)" }}
              >
                {t(`nav.${link.label.toLowerCase()}`)}
                {isActive && (
                  <span
                    className="absolute bottom-0 inset-x-3 h-[2px] bg-primary rounded-t-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Spacer for mobile */}
        <div className="flex-1 md:hidden" />

        {/* Actions */}
        <div className="flex items-center gap-1.5">

          {/* Language */}
          <button
            onClick={toggleLang}
            aria-label={i18n.language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            className="hidden sm:flex items-center gap-1.5 min-h-11 px-3 rounded-lg text-white/40 hover:text-white/75 hover:bg-white/5 transition-colors duration-200 text-[0.6875rem] font-semibold uppercase tracking-widest"
          >
            <Globe className="w-3.5 h-3.5" />
            {i18n.language === "ar" ? "EN" : "AR"}
          </button>

          {/* CTA */}
          <Link
            to="/request-quote"
            className="hidden md:flex items-center gap-1.5 min-h-11 px-4 rounded-xl text-sm font-semibold bg-white hover:bg-white/90 active:scale-[0.97] transition-all duration-200"
            style={{
              color: "var(--color-pyramid-navy)",
              transitionTimingFunction: "var(--ease-out-strong)",
            }}
          >
            {t("nav.requestQuote")}
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-white/65 hover:text-white hover:bg-white/8 transition-colors duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <span className="flex flex-col items-center justify-center gap-[5px] w-5" aria-hidden="true">
              <span
                className="block w-5 h-px bg-current rounded-full transition-all duration-200"
                style={{
                  transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none",
                  transitionTimingFunction: "var(--ease-out-strong)",
                }}
              />
              <span
                className="block w-5 h-px bg-current rounded-full transition-all duration-200"
                style={{
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? "scaleX(0)" : "scaleX(1)",
                  transitionTimingFunction: "var(--ease-out-strong)",
                }}
              />
              <span
                className="block w-5 h-px bg-current rounded-full transition-all duration-200"
                style={{
                  transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                  transitionTimingFunction: "var(--ease-out-strong)",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className="md:hidden overflow-hidden transition-[max-height,opacity] duration-300"
        style={{
          maxHeight: mobileOpen ? "600px" : "0px",
          opacity: mobileOpen ? 1 : 0,
          borderTop: mobileOpen ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          transitionTimingFunction: "var(--ease-out-strong)",
        }}
        aria-hidden={!mobileOpen}
      >
        <nav
          className="flex flex-col px-margin-mobile pt-4 pb-6 gap-1"
          aria-label={t("nav.primary")}
        >
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`nav-stagger flex items-center text-[1.0625rem] font-medium py-3 px-4 rounded-xl transition-colors duration-150 ${
                  isActive
                    ? "text-white bg-white/[0.08]"
                    : "text-white/55 hover:text-white hover:bg-white/[0.05]"
                }`}
                style={{ "--i": i } as React.CSSProperties}
              >
                {t(`nav.${link.label.toLowerCase()}`)}
                {isActive && (
                  <span
                    className="ltr:ml-auto rtl:mr-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}

          <div
            className="nav-stagger my-3 mx-4 h-px"
            style={{
              "--i": navLinks.length,
              background: "rgba(255,255,255,0.06)",
            } as React.CSSProperties}
            aria-hidden="true"
          />

          <button
            onClick={toggleLang}
            className="nav-stagger flex items-center gap-3 text-white/45 hover:text-white/75 text-sm font-medium py-3 px-4 rounded-xl hover:bg-white/[0.05] transition-colors duration-150 w-full text-start"
            style={{ "--i": navLinks.length + 1 } as React.CSSProperties}
          >
            <Globe className="w-4 h-4 shrink-0" />
            {i18n.language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          </button>

          <div
            className="nav-stagger px-4 pt-2"
            style={{ "--i": navLinks.length + 2 } as React.CSSProperties}
          >
            <Link
              to="/request-quote"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold bg-white hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
              style={{ color: "var(--color-pyramid-navy)" }}
            >
              {t("nav.requestQuote")}
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
