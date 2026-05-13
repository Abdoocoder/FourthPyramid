import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Factory, Phone, Mail, MapPin, ArrowUp, ShieldCheck } from "lucide-react";
import { navLinks, siteConfig } from "../../lib/constants";

function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <BackToTop />
      <footer className="bg-surface-container-highest border-t border-outline-variant w-full">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-gutter">
            <div className="md:col-span-4 flex flex-col gap-5">
              <Link to="/" aria-label="Home" className="flex items-center gap-2.5 text-on-surface">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                  <Factory className="w-5 h-5 text-on-primary" />
                </div>
                <span className="font-headline-md text-headline-md font-bold tracking-tight">{siteConfig.name}</span>
              </Link>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {t("footer.description")}
              </p>
              <div className="flex items-center gap-2 text-primary-fixed-dim">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-data-mono text-data-mono text-[11px] uppercase tracking-wider">{t("common.isoBadge")}</span>
              </div>
              <div className="flex flex-col gap-2 mt-1">
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors w-fit">
                  <Phone className="w-3.5 h-3.5" />
                  {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors w-fit">
                  <Mail className="w-3.5 h-3.5" />
                  {siteConfig.email}
                </a>
                <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {siteConfig.address}
                </span>
              </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              <nav aria-label={t("footer.navigation")} className="flex flex-col gap-4">
                <h3 className="font-body-sm text-body-sm font-semibold text-on-surface uppercase tracking-wider">{t("footer.navigation")}</h3>
                <div className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-150 w-fit"
                    >
                      {t(`nav.${link.label.toLowerCase()}`)}
                    </Link>
                  ))}
                </div>
              </nav>

              <nav aria-label={t("footer.company")} className="flex flex-col gap-4">
                <h3 className="font-body-sm text-body-sm font-semibold text-on-surface uppercase tracking-wider">{t("footer.company")}</h3>
                <div className="flex flex-col gap-3">
                  <Link to="/about" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors w-fit">{t("footer.aboutUs")}</Link>
                  <Link to="/industries" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors w-fit">{t("footer.industries")}</Link>
                  <Link to="/contact" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors w-fit">{t("footer.contactUs")}</Link>
                  <Link to="/request-quote" className="font-body-sm text-body-sm text-primary font-medium hover:text-primary-fixed-dim transition-colors w-fit">{t("nav.requestQuote")}</Link>
                </div>
              </nav>

              <div className="flex flex-col gap-4">
                <h3 className="font-body-sm text-body-sm font-semibold text-on-surface uppercase tracking-wider">{t("footer.support")}</h3>
                <div className="flex flex-col gap-3">
                  <Link to="/products" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors w-fit">{t("nav.products")}</Link>
                  <Link to="/contact" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors w-fit">{t("nav.contact")}</Link>
                  <a href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors w-fit">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-data-mono text-data-mono text-on-surface-variant/60 text-[11px] text-center md:text-left">
              {siteConfig.copyright}
            </p>
            <p className="font-data-mono text-data-mono text-on-surface-variant/60 text-[11px]">
              {t("footer.designedBy")}{" "}
              <a href="https://www.abdoocoder.dev" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline underline-offset-2">
                Abdoo Coder
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
