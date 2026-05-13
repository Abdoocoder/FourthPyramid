import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Factory, Globe } from "lucide-react";
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

  return (
    <header className="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant">
      <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto">
        <Link to="/" aria-label="Home" className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors duration-200">
          <Factory className="w-6 h-6" />
           <span className="font-headline-md text-headline-md tracking-tight font-bold">{siteConfig.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-body-sm text-body-sm font-medium transition-colors duration-150 py-2 ${
                pathname === link.href
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {t(`nav.${link.label.toLowerCase()}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm font-medium py-2"
            aria-label={i18n.language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Globe className="w-4 h-4" />
            {t("nav.language")}
          </button>
          <Button as="a" href="/request-quote" size="sm" variant="tertiary">
            {t("nav.requestQuote")}
          </Button>
          <button
            className="md:hidden text-on-surface p-3"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant">
          <nav className="flex flex-col px-margin-mobile py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-body-lg text-body-lg py-3 ${
                  pathname === link.href ? "text-primary font-semibold" : "text-on-surface-variant"
                }`}
              >
                {t(`nav.${link.label.toLowerCase()}`)}
              </Link>
            ))}
            <button
              onClick={() => { toggleLang(); setMobileOpen(false); }}
              className="flex items-center gap-1.5 text-on-surface-variant py-3 font-body-lg text-body-lg"
            >
              <Globe className="w-4 h-4" />
              {t("nav.language")}
            </button>
            <Button as="a" href="/request-quote" size="md" variant="tertiary" className="mt-2">
              {t("nav.requestQuote")}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
