import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../lib/usePageTitle";
import { CheckCircle, FlaskConical, Gauge, Wind, Settings } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useScrollReveal, useImageReveal } from "../lib/animations";

const metricsData = [
  { value: "1998", key: "established" },
  { value: "50M+", key: "unitsYear" },
  { value: "ISO", key: "certified" },
  { value: "24/7", key: "operations" },
];

const capabilitiesData = [
  {
    icon: <Wind className="w-8 h-8 text-primary" />,
    titleKey: "blowMolding",
    descKey: "blowMoldingDesc",
    tags: ["HDPE", "PET"],
    span: "md:col-span-7",
  },
  {
    icon: <Settings className="w-8 h-8 text-secondary" />,
    titleKey: "injectionMolding",
    descKey: "injectionMoldingDesc",
    tags: ["PP", "Tolerance ±0.1mm"],
    span: "md:col-span-5",
  },
];

const qualityPoints = [
  { icon: <CheckCircle className="w-5 h-5 text-primary" />, titleKey: "quality1Title", descKey: "quality1Desc" },
  { icon: <FlaskConical className="w-5 h-5 text-primary" />, titleKey: "quality2Title", descKey: "quality2Desc" },
  { icon: <Gauge className="w-5 h-5 text-primary" />, titleKey: "quality3Title", descKey: "quality3Desc" },
];

export function AboutPage() {
  const { t } = useTranslation();
  usePageTitle(t("nav.about"));
  const heroRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useScrollReveal(heroRef, ".reveal", 0.15);
  useScrollReveal(ctaRef, ".cta-reveal", 0.15);
  useImageReveal(qualityRef, ".img-reveal", 0.2);

  return (
    <>
      <section className="relative min-h-[450px] flex items-center border-b border-outline-variant">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80&auto=format')] bg-cover bg-center opacity-15" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div ref={heroRef} className="max-w-2xl bg-surface/90 backdrop-blur-sm p-5 sm:p-8 border border-outline-variant rounded-xl">
            <span className="reveal font-data-mono text-data-mono text-primary uppercase tracking-widest mb-4 block">{t("about.heroEyebrow")}</span>
            <h1 className="reveal font-display-lg text-[clamp(2rem,5vw,3rem)] md:text-display-lg text-on-surface mb-6 leading-[1.1]">
              {t("about.heroTitle")}
            </h1>
            <p className="reveal font-body-lg text-body-lg text-on-surface-variant">
              {t("about.heroDesc")}
            </p>
          </div>
        </div>
      </section>

      <section ref={metricsRef} className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-4">
          <h2 className="font-headline-md text-headline-md text-on-surface sticky top-32">{t("about.introTitle")}</h2>
        </div>
        <div className="md:col-span-8 space-y-6">
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[65ch]">
            {t("about.introDesc")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {metricsData.map((m) => (
              <div key={m.key} className="metric-box p-6 border border-outline-variant rounded-xl bg-surface">
                <span className="font-display-lg text-3xl text-primary block mb-2">{m.value}</span>
                <span className="font-data-mono text-data-mono text-on-surface-variant uppercase">{t(`about.${m.key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={capabilitiesRef} className="py-section-gap bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-12">
            <span className="font-data-mono text-data-mono text-primary uppercase tracking-widest mb-4 block">{t("about.capabilitiesEyebrow")}</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">{t("about.capabilitiesTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {capabilitiesData.map((cap) => (
              <div key={cap.titleKey} className={`cap-box ${cap.span} border border-outline-variant rounded-xl bg-surface p-8 flex flex-col justify-between group hover:shadow-card-hover transition-shadow duration-300`}>
                <div>
                  <div className="mb-4">{cap.icon}</div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{t(`about.${cap.titleKey}`)}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{t(`about.${cap.descKey}`)}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  {cap.tags.map((tag) => (
                    <span key={tag} className="bg-surface-variant text-on-surface px-3 py-1 text-[11px] font-data-mono uppercase tracking-wider rounded-sm">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={qualityRef} className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
        <div className="reveal h-full min-h-[400px] border border-outline-variant rounded-xl overflow-hidden bg-surface-container-highest img-reveal">
          <img
            className="w-full h-full object-cover opacity-60 dark:opacity-30"
            src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format"
            alt="Quality control laboratory"
            loading="lazy"
          />
        </div>
        <div className="reveal space-y-6 md:ps-8">
          <span className="font-data-mono text-data-mono text-tertiary uppercase tracking-widest block">{t("about.qualityEyebrow")}</span>
          <h2 className="font-display-lg text-[clamp(1.6rem,4vw,2.5rem)] text-on-surface leading-[1.1]">{t("about.qualityTitle")}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {t("about.qualityDesc")}
          </p>
          <ul className="space-y-4 pt-4">
            {qualityPoints.map((q) => (
              <li key={q.titleKey} className="flex items-start gap-3">
                <span className="mt-1">{q.icon}</span>
                <div>
                  <span className="font-button-label text-button-label text-on-surface block">{t(`about.${q.titleKey}`)}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{t(`about.${q.descKey}`)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={ctaRef} className="bg-tertiary text-on-tertiary py-20 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="cta-reveal font-display-lg text-[clamp(1.8rem,4vw,3rem)] mb-6 leading-[1.1]">{t("about.ctaTitle")}</h2>
          <p className="cta-reveal font-body-lg text-body-lg text-on-tertiary/80 mb-10 max-w-2xl mx-auto">
            {t("about.ctaDesc")}
          </p>
          <div className="cta-reveal">
            <Button as="a" href="/request-quote" size="lg" variant="tertiary">
              {t("about.ctaButton")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
