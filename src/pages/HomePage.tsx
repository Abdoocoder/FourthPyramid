import { useRef, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../lib/usePageTitle";
import { ArrowRight, Factory, Package, FlaskConical, Fuel } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { localized } from "../lib/localized";
import { useScrollReveal, useScramble, useTiltCard, useTextSplit, useParallax } from "../lib/animations";
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

const capabilityLayouts = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
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

function TiltWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useTiltCard(ref, 10);
  return <div ref={ref} className={className}>{children}</div>;
}

export function HomePage() {
  const { t } = useTranslation();
  usePageTitle(t("nav.home"));
  const cats = useQuery(api.categories.list);

  const HERO_IMAGE = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&q=80&auto=format";
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const capHeadingRef = useRef<HTMLHeadingElement>(null);
  const whyHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = heroContentRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = [
      el.querySelector(".hero-eyebrow"),
      el.querySelector("h1"),
      el.querySelector("p"),
      el.querySelector(".hero-cta"),
    ].filter(Boolean);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.14, ease: "power4.out", delay: 0.1 }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const { isPaused: marqueePaused, toggle: toggleMarquee } = useMarquee(marqueeRef);
  useScrollReveal(metricsRef, ".metric-card", 0.1);
  useScrollReveal(capabilitiesRef, ".cap-card, .reveal", 0.12);
  useScrollReveal(whyRef, ".why-card, .reveal", 0.12);
  useScrollReveal(ctaRef, ".cta-item", 0.15);
  useParallax(heroImageRef, 0.25);
  useTextSplit(capHeadingRef, { stagger: 0.03 });
  useTextSplit(whyHeadingRef, { stagger: 0.03, delay: 0.1 });

  const heroTitleRef = useScramble(t("home.heroTitle"));

  return (
    <div className="overflow-x-hidden w-full max-w-full">

      {/* ── Hero: split-screen, content start-aligned ── */}
      <section aria-label={t("home.heroTitle")} className="relative min-h-[90dvh] bg-hero-surface overflow-hidden flex items-center">
        {/* Full-bleed image, gradient fades from start (dark) to end (visible) */}
        <div ref={heroImageRef} className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover opacity-45"
            loading="eager"
          />
          {/* Logical gradient: dark on content side, image bleeds through on the other */}
          <div className="absolute inset-0 bg-gradient-to-e from-hero-surface from-[38%] via-hero-surface/75 to-hero-surface/15" />
          {/* Bottom darkening for both orientations */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-hero-surface to-transparent" />
        </div>

        <div ref={heroContentRef} className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8 py-32 md:py-0">
          <div className="flex flex-col max-w-2xl">
            <span className="hero-eyebrow font-data-mono text-data-mono text-primary/80 uppercase tracking-[0.2em] text-[11px] mb-8 block">
              {t("home.heroEyebrow")}
            </span>
            <h1 className="font-display-lg text-[clamp(2.5rem,5vw,4.5rem)] text-inverse-on-surface leading-[1.05] tracking-[-0.02em] mb-6">
              <span ref={heroTitleRef}>{t("home.heroTitle")}</span>
              {" "}
              <span
                className="inline-block w-16 h-8 md:w-24 md:h-12 rounded-full align-middle mx-2 bg-cover bg-center"
                style={{ backgroundImage: `url(${HERO_IMAGE.replace("w=1920", "w=200")}&h=200&fit=crop)` }}
              />
              {" "}
              <span className="text-primary">{t("home.heroTitleAccent")}</span>
            </h1>
            <p className="font-body-lg text-body-lg text-inverse-on-surface/70 max-w-xl mb-12 leading-relaxed">
              {t("home.heroDesc")}
            </p>
            <div className="hero-cta flex flex-col sm:flex-row items-start gap-4">
              <Button as="a" href="/request-quote" size="lg" variant="tertiary" className="px-10 py-4">
                {t("home.requestQuote")} <ArrowRight className="w-4 h-4" />
              </Button>
              <Button as="a" href="/products" variant="dark" size="lg" className="px-10 py-4">
                {t("home.viewProducts")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section ref={metricsRef} aria-label={t("home.metricsSection")} className="py-24 md:py-32 bg-surface border-b border-outline-variant">
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
            <div className="metric-card md:col-span-7 flex flex-col justify-center gap-0 md:ps-8 border-t md:border-t-0 pt-6 md:pt-0">
              {[
                { value: "50M+", labelKey: "unitsPerYear" },
                { value: metrics[0].value, labelKey: "established" },
                { value: "ISO 9001", labelKey: "certified" },
              ].map((item) => (
                <div key={item.labelKey} className="flex items-center gap-6 py-4 border-b border-outline-variant last:border-0">
                  <span className="font-data-mono text-[0.9375rem] font-semibold text-primary tabular-nums w-16 shrink-0">
                    {item.value}
                  </span>
                  <span className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-[0.15em] text-[11px]">
                    {t(`home.${item.labelKey}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section ref={capabilitiesRef} aria-labelledby="capabilities-heading" className="relative overflow-hidden py-24 md:py-32 bg-surface-container-low">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-[0.16]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(74,144,226,0.16) 0, transparent 18%), radial-gradient(circle at 80% 10%, rgba(26,43,72,0.08) 0, transparent 14%), linear-gradient(rgba(26,43,72,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,43,72,0.03) 1px, transparent 1px)",
            backgroundSize: "auto, auto, 28px 28px, 28px 28px",
            backgroundPosition: "0 0, 0 0, 0 0, 0 0",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          {/* Left-aligned section opener */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mb-16">
            <div className="md:col-span-7">
              <span className="reveal font-data-mono text-data-mono text-primary uppercase tracking-[0.2em] text-[11px] block mb-4">
                {t("home.capabilitiesEyebrow")}
              </span>
              <h2 ref={capHeadingRef} id="capabilities-heading" className="reveal font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-on-surface leading-[1.05] tracking-[-0.02em]">
                {t("home.capabilitiesTitle")}
              </h2>
            </div>
            <div className="md:col-span-5 flex items-end">
              <p className="reveal font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {t("home.capabilitiesDesc")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:auto-rows-[minmax(14rem,auto)] md:grid-flow-dense">
            {cats === undefined ? (
              <div className="col-span-full text-center py-20 animate-pulse text-on-surface-variant">{t("products.loading")}</div>
            ) : cats.length === 0 ? (
              <div className="col-span-full text-center py-20 text-on-surface-variant">{t("products.noResults")}</div>
            ) : (
              cats.map((cat, i) => (
                <TiltWrapper key={cat.slug} className={capabilityLayouts[i] ?? "md:col-span-6"}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="cap-card hover-lift group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-[0_1px_0_rgba(26,43,72,0.03)] transition-[border-color,box-shadow,transform,background-color] duration-300 ease-out-strong hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover motion-reduce:hover:translate-y-0 block h-full"
                >
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out-strong group-hover:opacity-100 opacity-90"
                    aria-hidden="true"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(244,247,249,0.18))",
                    }}
                  />
                  <div className={`relative flex h-full flex-col ${i === 0 ? "md:flex-row" : ""}`}>
                    <div className={`${i === 0 ? "md:w-[42%] md:border-e" : "md:h-36"} relative flex items-center justify-center border-b border-outline-variant bg-surface-container-low px-6 py-8 md:border-b-0 md:px-8`}>
                      <div
                        className="absolute inset-0 pointer-events-none opacity-60"
                        aria-hidden="true"
                        style={{
                          background: "radial-gradient(circle at 50% 35%, rgba(74,144,226,0.18), transparent 60%)",
                        }}
                      />
                      <span className="absolute start-5 top-4 font-data-mono text-[0.6875rem] uppercase tracking-[0.22em] text-on-surface-variant/45">
                        0{i + 1}
                      </span>
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-outline-variant bg-surface text-primary shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out-strong group-hover:scale-[1.04] group-hover:border-primary/30 group-hover:shadow-card-hover">
                        <div className="scale-[1.35]">{iconMap[cat.icon]}</div>
                      </div>
                    </div>
                    <div className="relative flex flex-1 flex-col justify-between p-6 md:p-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="h-px w-8 bg-outline-variant" aria-hidden="true" />
                          <span className="font-data-mono text-[0.625rem] uppercase tracking-[0.24em] text-on-surface-variant/60">
                            {t("home.capabilitiesEyebrow")}
                          </span>
                        </div>
                        <div className="max-w-[34ch]">
                          <h3 className="text-[1.35rem] font-semibold leading-tight text-on-surface md:text-[1.5rem]">
                            {localized(cat, "name")}
                          </h3>
                          <p className="mt-3 max-w-[32ch] font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                            {localized(cat, "description")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-2 opacity-70 transition-opacity duration-200 ease-out-strong group-hover:opacity-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                        <span className="h-px w-10 bg-outline-variant/70" aria-hidden="true" />
                      </div>
                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-outline-variant pt-4">
                        <span className="font-data-mono text-[0.6875rem] uppercase tracking-[0.22em] text-primary">
                          0{i + 1} / 04
                        </span>
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-[color,transform] duration-150 ease-out-strong group-hover:text-primary group-hover:translate-x-0.5">
                          <span>{t("home.exploreRange")}</span>
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                      <span
                        className="pointer-events-none absolute end-4 bottom-2 font-display-lg text-[clamp(3rem,8vw,6rem)] leading-none text-primary/6"
                        aria-hidden="true"
                      >
                        0{i + 1}
                      </span>
                    </div>
                  </div>
                </Link>
                </TiltWrapper>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Why Fourth Pyramid ── */}
      <section ref={whyRef} aria-labelledby="why-heading" className="py-24 md:py-32 bg-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          {/* Left-aligned opener */}
          <div className="mb-16">
            <span className="reveal font-data-mono text-data-mono text-primary uppercase tracking-[0.2em] text-[11px] block mb-4">
              {t("home.whyEyebrow")}
            </span>
            <h2 ref={whyHeadingRef} id="why-heading" className="reveal font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-on-surface leading-[1.05] tracking-[-0.02em] max-w-2xl">
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

      {/* ── Marquee ── */}
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
        <div className="flex marquee-track gap-0 items-center whitespace-nowrap">
          {partners.map((p, i) => (
            <span key={i} className="inline-flex items-center gap-0 flex-shrink-0">
              <span className="font-data-mono text-data-mono text-on-surface-variant/50 uppercase tracking-[0.2em] text-sm px-10">
                {p}
              </span>
              <span className="text-primary/25 text-xs select-none" aria-hidden="true">◈</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA: left-aligned, split layout ── */}
      <section ref={ctaRef} aria-labelledby="cta-heading" className="py-32 md:py-48 bg-hero-surface relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-px bg-primary/35" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-pyramid-navy/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-7">
              <div className="cta-item">
                <h2 id="cta-heading" className="font-display-lg text-[clamp(2rem,5vw,4rem)] text-inverse-on-surface mb-6 leading-[1.05] tracking-[-0.02em]">
                  {t("home.ctaTitle")}
                </h2>
              </div>
              <div className="cta-item">
                <p className="font-body-lg text-body-lg text-inverse-on-surface/70 mb-10 max-w-xl leading-relaxed">
                  {t("home.ctaDesc")}
                </p>
              </div>
              <div className="cta-item">
                <Button as="a" href="/request-quote" size="lg" variant="tertiary" className="px-12 py-4 text-lg">
                  {t("home.ctaButton")} <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="cta-item md:col-span-5 flex flex-col justify-center gap-0 md:ps-8">
              {[t("about.quality1Title"), t("about.quality2Title"), t("about.quality3Title")].map((cred) => (
                <div key={cred} className="flex items-center gap-3 py-4 border-b border-white/10 first:pt-0 last:border-0 last:pb-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                  <span className="font-body-sm text-body-sm text-inverse-on-surface/55">{cred}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
