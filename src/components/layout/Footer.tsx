import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Factory } from "lucide-react";
import { navLinks, siteConfig } from "../../lib/constants";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant w-full py-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="md:col-span-4 flex flex-col gap-4">
          <Link to="/" aria-label="Home" className="flex items-center gap-2 text-on-surface">
            <Factory className="w-5 h-5" />
            <span className="font-headline-md text-headline-md">{siteConfig.name}</span>
          </Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
            {t("footer.description")}
          </p>
          <p className="font-data-mono text-data-mono text-on-surface-variant mt-2">
            {siteConfig.copyright}
          </p>
          <p className="font-data-mono text-data-mono text-on-surface-variant/60 text-[11px]">
            {t("footer.designedBy")}{" "}
            <a href="https://www.abdoocoder.dev" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline underline-offset-2">
              Abdoo Coder
            </a>
          </p>
        </div>
        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
          <nav aria-label={t("footer.navigation")} className="flex flex-col gap-3">
            <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">{t("footer.navigation")}</h3>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-150 underline-offset-4 hover:underline"
              >
                {t(`nav.${link.label.toLowerCase()}`)}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">{t("footer.contact")}</h3>
            <a href={`tel:${siteConfig.phone}`} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              {siteConfig.email}
            </a>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{siteConfig.address}</span>
          </div>
          <nav aria-label={t("footer.company")} className="flex flex-col gap-3">
            <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">{t("footer.company")}</h3>
            <Link to="/about" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline">{t("footer.aboutUs")}</Link>
            <Link to="/industries" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline">{t("footer.industries")}</Link>
            <Link to="/contact" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline">{t("footer.contactUs")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
