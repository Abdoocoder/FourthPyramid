import { useRef, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../lib/usePageTitle";
import { ArrowRight, Factory, Package, FlaskConical, Fuel } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { localized } from "../lib/localized";
import { useScrollReveal } from "../lib/animations";
import { useInViewCountUp } from "../lib/useCountUp";
import gsap from "gsap";

const iconMap: Record<string, React.ReactNode> = {
  bottle: <Factory className="w-8 h-8" />,
  container: <Package className="w-8 h-8" />,
  chemical: <FlaskConical className="w-8 h-8" />,
  jerrycan: <Fuel className="w-8 h-8" />,
};

const metrics = [
  { value: "1998", key: "established" },
  { value: "50M+", key: "unitsPerYear" },
  { value: "25+", key: "yearsExp" },
  { value: "ISO", key: "certified" },
];

const partners = [
  "ISO 9001:2015", "UN Certified", "FDA Approved", "HDPE Certified",
  "PET Certified", "Food Grade", "UV Stabilized", "Recycling Partner",
];

function MetricValue({ metric }: { metric: { value: string; key: string } }) {
  const countUpMap: Record<string, { end: number; suffix: string }> = {
    established: { end: 1998, suffix: "" },
    unitsPerYear: { end: 50, suffix: "M+" },
    yearsExp: { end: 25, suffix: "+" },
  };
  const config = countUpMap[metric.key];
  const { ref, formatted } = useInViewCountUp({
    end: config?.end ?? 0,
    suffix: config?.suffix ?? "",
    threshold: 0.4,
  });
  if (config) {
    return (
      <span ref={ref} className="block font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-primary leading-none mb-3 tabular-nums">
        {formatted}
      </span>
    );
  }
  return (
    <span className="block font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-primary leading-none mb-3">
      {metric.value}
    </span>
  );
}

function useMarquee(ref: React.RefObject<HTMLDivElement | null>) {
  const [isPaused, setIsPaused] = useState(false);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const track = el.querySelector(".marquee-track") as HTMLElement;
    if (!track) return;
    const clone = track.cloneNode(true) as HTMLElement;
    clone.setAttribute("aria-hidden", "true");
    el.appendChild(clone);
    const ctx = gsap.context(() => {
      animRef.current = gsap.to([track, clone], { xPercent: -50, duration: 30, repeat: -1, ease: "none" });
    }, el);
    const pause = () => { animRef.current?.pause(); setIsPaused(true); };
    const resume = () => { animRef.current?.play(); setIsPaused(false); };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    return () => {
      ctx.revert();
      if (clone.parentNode === el) el.removeChild(clone);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [ref]);

  const toggle = useCallback(() => {
    if (!animRef.current) return;
    if (animRef.current.paused()) {
      animRef.current.play();
      setIsPaused(false);
    } else {
      animRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  return { isPaused, toggle };
}

export function HomePage() {
  const { t } = useTranslation();
  usePageTitle(t("nav.home"));
  const cats = useQuery(api.categories.list);

  const HERO_IMAGE = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&q=80&auto=format";
  const heroContentRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroContentRef.current;
    if (!el) return;
    const items = [el.querySelector("h1"), el.querySelector("p"), el.querySelector(".hero-cta")];
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items.filter(Boolean),
        { opacity: 0, y: 52 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power3.out", delay: 0.15 }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const { isPaused: marqueePaused, toggle: toggleMarquee } = useMarquee(marqueeRef);
  useScrollReveal(metricsRef, ".metric-card", 0.1);
  useScrollReveal(capabilitiesRef, ".cap-card, .reveal", 0.12);
  useScrollReveal(whyRef, ".why-card, .reveal", 0.12);
  useScrollReveal(ctaRef, ".cta-item", 0.15);

  return (
    <div className="overflow-x-hidden w-full max-w-full">
      <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-hero-surface">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover opacity-30"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-hero-surface/60 via-hero-surface/40 to-hero-surface" />
        </div>
        <div ref={heroContentRef} className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8 py-24 md:py-0 text-center">
          <h1 className="font-display-lg text-[clamp(2.5rem,5vw,4.5rem)] text-inverse-on-surface leading-[1.05] tracking-[-0.02em] mb-6 max-w-5xl mx-auto">
            {t("home.heroTitle") + " "}
            <span
              className="inline-block w-16 h-8 md:w-24 md:h-12 rounded-full align-middle mx-2 bg-cover bg-center"
              style={{ backgroundImage: `url(${HERO_IMAGE.replace("w=1920", "w=200")}&h=200&fit=crop)` }}
            />
            {" "}
            <span className="text-primary">{t("home.heroTitleAccent")}</span>
          </h1>
          <p className="font-body-lg text-body-lg text-inverse-on-surface/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("home.heroDesc")}
          </p>
          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button as="a" href="/request-quote" size="lg" variant="tertiary" className="px-10 py-4">
              {t("home.requestQuote")} <ArrowRight className="w-4 h-4" />
            </Button>
            <Button as="a" href="/products" variant="dark" size="lg" className="px-10 py-4">
              {t("home.viewProducts")}
            </Button>
          </div>
        </div>
      </section>

      <section ref={metricsRef} className="py-24 md:py-32 bg-surface border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="metric-card md:col-span-5 flex flex-col gap-4 border-e border-outline-variant md:pe-12">
              <MetricValue metric={metrics[2]} />
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-[40ch]">
                {t("home.yearsExpContext")}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-data-mono text-data-mono text-primary uppercase tracking-[0.15em] text-[11px]">
                  {t("home.established")} {metrics[0].value}
                </span>
                <span className="w-8 h-px bg-outline" />
                <span className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-[0.15em] text-[11px]">
                  {t("home.amman")}
                </span>
              </div>
            </div>
            <div className="metric-card md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 md:ps-4">
              {[metrics[0], metrics[1], metrics[3]].map((m) => (
                <div key={m.key} className="flex flex-col gap-2">
                  <MetricValue metric={m} />
                  <span className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-[0.15em] text-[11px]">
                    {t(`home.${m.key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={capabilitiesRef} className="py-24 md:py-32 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="reveal font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-on-surface leading-[1.05] tracking-[-0.02em] max-w-3xl mx-auto">
              {t("home.capabilitiesTitle")}
            </h2>
            <p className="reveal font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-4 leading-relaxed">
              {t("home.capabilitiesDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
            {cats === undefined ? (
              <div className="col-span-full text-center py-20 animate-pulse text-on-surface-variant">{t("products.loading")}</div>
            ) : cats.length === 0 ? (
              <div className="col-span-full text-center py-20 text-on-surface-variant">{t("products.noResults")}</div>
            ) : (
              cats.map((cat, i) => (
                <Link
                  key={cat.slug}
                  to={`/products?category=${cat.slug}`}
                  className={`cap-card hover-lift group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface hover:border-primary transition-colors duration-300 ${i === 0 ? "md:col-span-2 md:row-span-1" : ""}`}
                >
                  <div className={`flex flex-col ${i === 0 ? "md:flex-row" : ""} h-full`}>
                    <div className={`${i === 0 ? "md:w-2/5 md:border-r" : ""} bg-surface-container p-8 md:p-10 flex items-center justify-center border-b border-outline-variant md:border-b-0`}>
                      <div className="text-primary scale-[1.5]">{iconMap[cat.icon]}</div>
                    </div>
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                      <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">{localized(cat, "name")}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{localized(cat, "description")}</p>
                      <span className="font-data-mono text-data-mono text-primary uppercase tracking-wider text-[11px] group-hover:underline underline-offset-4">
                        {t("home.exploreRange")} <ArrowRight className="w-3 h-3 inline" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section ref={whyRef} className="py-24 md:py-32 bg-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="reveal font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-on-surface leading-[1.05] tracking-[-0.02em] max-w-3xl mx-auto">
              {t("home.whyTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="why-card hover-lift group md:col-span-7 relative bg-surface-container-low border border-outline-variant rounded-2xl p-8 md:p-10 hover:border-primary/30 transition-colors duration-300 flex flex-col justify-between gap-8 min-h-72">
              <div>
                <span className="font-display-lg text-[clamp(3rem,6vw,5rem)] text-primary leading-none block mb-4">
                  25+
                </span>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">{t("home.reason1Title")}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed max-w-[45ch]">
                  {t("home.reason1Desc")}
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-outline-variant">
                <span className="font-data-mono text-data-mono text-[11px] text-on-surface-variant/40 uppercase tracking-widest">01</span>
                <span className="w-6 h-px bg-outline-variant" />
                <span className="font-data-mono text-data-mono text-[11px] text-primary uppercase tracking-widest">
                  {t("home.established")} 1998
                </span>
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col gap-6">
              {[
                { titleKey: "reason2Title", stat: "ISO", descKey: "reason2Desc", index: "02" },
                { titleKey: "reason3Title", stat: "100%", descKey: "reason3Desc", index: "03" },
              ].map((s) => (
                <div
                  key={s.titleKey}
                  className="why-card hover-lift group relative bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors duration-300 flex flex-col gap-4 flex-1"
                >
                  <span className="font-display-lg text-[clamp(2rem,3vw,2.5rem)] text-primary leading-none">
                    {s.stat}
                  </span>
                  <div>
                    <h3 className="font-headline-md text-lg font-bold text-on-surface mb-1">{t(`home.${s.titleKey}`)}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{t(`home.${s.descKey}`)}</p>
                  </div>
                  <span className="font-data-mono text-data-mono text-[11px] text-on-surface-variant/30 uppercase tracking-widest mt-auto">
                    {s.index}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={marqueeRef}
        aria-label={t("home.certificationsBadges")}
        className="py-16 md:py-20 bg-surface-container-highest overflow-hidden border-y border-outline-variant relative"
      >
        <button
          onClick={toggleMarquee}
          aria-label={marqueePaused ? t("home.resumeMarquee") : t("home.pauseMarquee")}
          className="absolute end-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface/80 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface transition-colors"
        >
          {marqueePaused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M3 2l7 4-7 4V2z"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="2" y="2" width="3" height="8"/>
              <rect x="7" y="2" width="3" height="8"/>
            </svg>
          )}
        </button>
        <div className="flex marquee-track gap-12 items-center whitespace-nowrap">
          {partners.map((p, i) => (
            <span key={i} className="font-data-mono text-data-mono text-on-surface-variant/50 uppercase tracking-[0.2em] text-sm flex-shrink-0">
              {p}
            </span>
          ))}
        </div>
      </section>

      <section ref={ctaRef} className="py-32 md:py-48 bg-hero-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center">
          <div className="cta-item">
            <h2 className="font-display-lg text-[clamp(2rem,5vw,4rem)] text-inverse-on-surface mb-6 leading-[1.05] tracking-[-0.02em]">
              {t("home.ctaTitle")}
            </h2>
          </div>
          <div className="cta-item">
            <p className="font-body-lg text-body-lg text-inverse-on-surface/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("home.ctaDesc")}
            </p>
          </div>
          <div className="cta-item">
            <Button as="a" href="/request-quote" size="lg" variant="tertiary" className="px-12 py-4 text-lg">
              {t("home.ctaButton")} <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
