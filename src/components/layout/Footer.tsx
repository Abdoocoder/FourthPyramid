import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, ArrowUp, ShieldCheck, MessageCircle } from "lucide-react";
import { navLinks, siteConfig } from "../../lib/constants";

function BackToTop() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("footer.backToTop")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="fixed bottom-6 ltr:right-6 rtl:left-6 z-40 w-11 h-11 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 250ms var(--ease-out-strong), transform 250ms var(--ease-out-strong)",
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

const companyLinks = [
  { key: "footer.aboutUs", href: "/about" },
  { key: "footer.industries", href: "/industries" },
  { key: "nav.products", href: "/products" },
  { key: "footer.contactUs", href: "/contact" },
];

export function Footer() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <>
      <BackToTop />
      <footer className="bg-pyramid-navy w-full">

        {/* Main body */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16 md:pt-20 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-x-gutter md:gap-y-0">

            {/* ── Brand column ── */}
            <div className="md:col-span-5 relative flex flex-col gap-6">

              {/* Ghost year watermark */}
              <span
                aria-hidden="true"
                className="absolute ltr:-right-6 rtl:-left-6 -top-2 text-[8rem] md:text-[11rem] font-black leading-none select-none pointer-events-none"
                style={{ color: "rgba(255,255,255,0.025)", fontVariantNumeric: "tabular-nums", zIndex: 0 }}
              >
                1998
              </span>

              <div className="relative" style={{ zIndex: 1 }}>
                <Link to="/" aria-label="Fourth Pyramid Home" className="flex items-center gap-3 w-fit">
                  <img
                    src="/logo.svg"
                    alt="Fourth Pyramid"
                    className="h-8 w-auto"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                  <div>
                    <p className="text-white font-bold text-[1.0625rem] leading-tight tracking-tight">
                      Fourth Pyramid
                    </p>
                    <p className="text-white/35 text-[0.625rem] uppercase tracking-[0.18em]">
                      Plastic Industries
                    </p>
                  </div>
                </Link>
              </div>

              <p className="text-white/45 text-sm leading-relaxed max-w-[34ch] relative" style={{ zIndex: 1 }}>
                {t("footer.description")}
              </p>

              {/* ISO badge */}
              <div
                className="flex items-center gap-2.5 w-fit px-3 py-2 rounded-lg"
                style={{
                  border: "1px solid rgba(74,144,226,0.3)",
                  background: "rgba(74,144,226,0.06)",
                  zIndex: 1,
                  position: "relative",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-[0.625rem] font-semibold uppercase tracking-[0.16em]">
                  {t("common.isoBadge")}
                </span>
              </div>

              {/* Contact block */}
              <div className="flex flex-col relative" style={{ zIndex: 1 }}>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="group flex items-center gap-3 py-3 text-white/45 hover:text-white/90 transition-colors duration-200"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-primary/50 group-hover:text-primary transition-colors duration-200" />
                  <span className="text-sm font-mono tracking-wide">{siteConfig.phone}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group flex items-center gap-3 py-3 text-white/45 hover:text-white/90 transition-colors duration-200"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-primary/50 group-hover:text-primary transition-colors duration-200" />
                  <span className="text-sm">{siteConfig.email}</span>
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 py-3 text-white/45 hover:text-white/90 transition-colors duration-200"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <MessageCircle className="w-3.5 h-3.5 flex-shrink-0 text-primary/50 group-hover:text-primary transition-colors duration-200" />
                  <span className="text-sm font-mono tracking-wide">{siteConfig.whatsapp}</span>
                </a>
                <div className="flex items-start gap-3 py-3 text-white/30">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">
                    {isAr ? siteConfig.address_ar : siteConfig.address}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Nav + CTA column ── */}
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">

              {/* Navigation */}
              <nav aria-label={t("footer.navigation")} className="flex flex-col gap-4">
                <span className="text-white/20 text-[0.5625rem] font-semibold uppercase tracking-[0.18em]">
                  {t("footer.navigation")}
                </span>
                <div className="flex flex-col">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-white/50 hover:text-white text-sm py-1.5 w-fit ltr:hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-200"
                      style={{ transitionTimingFunction: "var(--ease-out-strong)" }}
                    >
                      {t(`nav.${link.label.toLowerCase()}`)}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Company */}
              <nav aria-label={t("footer.company")} className="flex flex-col gap-4">
                <span className="text-white/20 text-[0.5625rem] font-semibold uppercase tracking-[0.18em]">
                  {t("footer.company")}
                </span>
                <div className="flex flex-col">
                  {companyLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-white/50 hover:text-white text-sm py-1.5 w-fit ltr:hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-200"
                      style={{ transitionTimingFunction: "var(--ease-out-strong)" }}
                    >
                      {t(link.key)}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* CTA block */}
              <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                <span className="text-white/20 text-[0.5625rem] font-semibold uppercase tracking-[0.18em]">
                  {t("footer.support")}
                </span>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/request-quote"
                    className="group flex items-center justify-between gap-4 px-4 py-3 rounded-xl transition-all duration-250"
                    style={{
                      border: "1px solid rgba(74,144,226,0.25)",
                      background: "rgba(74,144,226,0.06)",
                      transitionTimingFunction: "var(--ease-out-strong)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(74,144,226,0.12)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,144,226,0.45)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(74,144,226,0.06)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,144,226,0.25)";
                    }}
                  >
                    <span className="text-white text-sm font-medium">{t("nav.requestQuote")}</span>
                    <ArrowUp
                      className="w-3.5 h-3.5 text-primary flex-shrink-0 ltr:rotate-[45deg] rtl:rotate-[-45deg] ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                    />
                  </Link>

                  <p className="text-white/25 text-xs leading-relaxed">
                    {t("footer.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-5 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-white/25 text-xs text-center md:text-start">
              {siteConfig.copyright}
            </p>
            <p className="text-white/25 text-xs">
              {t("footer.designedBy")}{" "}
              <a
                href="https://www.abdoocoder.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-primary transition-colors duration-200"
                style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}
              >
                Abdoo Coder
              </a>
            </p>
          </div>
        </div>

      </footer>
    </>
  );
}
