import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe } from "lucide-react";
import { navLinks, siteConfig } from "../../lib/constants";
import { Button } from "../ui/Button";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(next);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinkClass = (href: string) =>
    `font-body-sm text-body-sm font-medium transition-colors duration-150 py-2 px-3 rounded-lg ${
      pathname === href
        ? "bg-primary-container text-on-primary-container font-semibold"
        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
    }`;

  return (
    <header className="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant">
      <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto">
        <Link to="/" aria-label="Home" className="flex items-center gap-2.5 text-on-surface hover:text-primary transition-colors duration-200">
          <img src="/logo.svg" alt="Fourth Pyramid" className="h-9 w-auto" />
          <span className="font-headline-md text-headline-md tracking-tight font-bold hidden sm:inline">{siteConfig.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className={navLinkClass(link.href)}>
              {t(`nav.${link.label.toLowerCase()}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm font-medium py-2 px-2 rounded-lg hover:bg-surface-container"
            aria-label={i18n.language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{t("nav.language")}</span>
          </button>
          <Link
            to="/admin"
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors py-2 px-2 rounded-lg hover:bg-surface-container hidden md:inline"
          >
            {t("nav.adminLogin")}
          </Link>
          <Button as="a" href="/request-quote" size="sm" variant="tertiary">
            {t("nav.requestQuote")}
          </Button>
          <button
            className="md:hidden text-on-surface p-2.5 rounded-lg hover:bg-surface-container transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden bg-surface border-t border-outline-variant overflow-hidden transition-[max-height,opacity] duration-300 ease-out-strong ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-margin-mobile py-4 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-body-lg text-body-lg py-3 px-4 rounded-lg transition-colors duration-150 ${
                pathname === link.href
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              {t(`nav.${link.label.toLowerCase()}`)}
            </Link>
          ))}
          <div className="h-px bg-outline-variant my-2 mx-4" />
          <button
            onClick={() => { toggleLang(); }}
            className="flex items-center gap-2 text-on-surface-variant py-3 px-4 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors font-body-lg text-body-lg"
          >
            <Globe className="w-4 h-4" />
            {t("nav.language")}
          </button>
          <Link
            to="/admin"
            className="font-body-lg text-body-lg py-3 px-4 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            {t("nav.adminLogin")}
          </Link>
          <div className="px-4 mt-2">
            <Button as="a" href="/request-quote" size="md" variant="tertiary" className="w-full justify-center">
              {t("nav.requestQuote")}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
