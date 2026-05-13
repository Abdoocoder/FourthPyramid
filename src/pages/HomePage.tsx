import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Factory, Package, FlaskConical, Fuel } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { localized } from "../lib/localized";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

function useEntryAnimation(ref: React.RefObject<HTMLDivElement | null>, selector: string, stagger = 0.15) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(selector);
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(targets, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.8, stagger, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }, el);
    return () => ctx.revert();
  }, [ref, selector, stagger]);
}

function useMarquee(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const track = el.querySelector(".marquee-track") as HTMLElement;
    if (!track) return;
    const clone = track.cloneNode(true) as HTMLElement;
    el.appendChild(clone);
    const ctx = gsap.context(() => {
      gsap.to([track, clone], { xPercent: -50, duration: 30, repeat: -1, ease: "none" });
    }, el);
    return () => ctx.revert();
  }, [ref]);
}

export function HomePage() {
  const { t } = useTranslation();
  const cats = useQuery(api.categories.list);

  const metricsRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEntryAnimation(metricsRef, ".metric-card", 0.15);
  useEntryAnimation(capabilitiesRef, ".cap-card", 0.1);
  useEntryAnimation(ctaRef, ".cta-item", 0.2);
  useMarquee(marqueeRef);

  return (
    <main className="overflow-x-hidden w-full max-w-full">
      <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-on-background">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&q=80&auto=format"
            alt=""
            className="w-full h-full object-cover opacity-30"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-on-background/60 via-on-background/40 to-on-background" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8 py-24 md:py-0 text-center">
          <h1 className="font-display-lg text-[clamp(2.5rem,5vw,4.5rem)] text-inverse-on-surface leading-[1.05] tracking-[-0.02em] mb-6 max-w-5xl mx-auto">
            {t("home.heroTitle") + " "}
            <span
              className="inline-block w-16 h-8 md:w-24 md:h-12 rounded-full align-middle mx-2 bg-cover bg-center"
              style={{ backgroundImage: "url(https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop&auto=format)" }}
            />
            {" "}
            <span className="text-primary">{t("home.heroTitleAccent")}</span>
          </h1>
          <p className="font-body-lg text-body-lg text-inverse-on-surface/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("home.heroDesc")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button as="a" href="/request-quote" size="lg" variant="tertiary" className="px-10 py-4">
              {t("home.requestQuote")} <ArrowRight className="w-4 h-4" />
            </Button>
            <Button as="a" href="/products" variant="dark" size="lg" className="px-10 py-4">
              {t("home.viewProducts")}
            </Button>
          </div>
        </div>
      </section>

      <section ref={metricsRef} className="py-24 md:py-32 bg-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant border border-outline-variant rounded-2xl overflow-hidden">
            {metrics.map((m) => (
              <div key={m.key} className="metric-card bg-surface p-8 md:p-10 text-center">
                <span className="block font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-primary leading-none mb-3">
                  {m.value}
                </span>
                <span className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-[0.15em] text-[11px]">
                  {t(`home.${m.key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={capabilitiesRef} className="py-24 md:py-32 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-on-surface leading-[1.05] tracking-[-0.02em] max-w-3xl mx-auto">
              {t("home.capabilitiesTitle")}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-4 leading-relaxed">
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
                  className={`cap-card group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface hover:border-primary transition-colors duration-300 ${i === 0 ? "md:col-span-2 md:row-span-1" : ""}`}
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

      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-on-surface leading-[1.05] tracking-[-0.02em] max-w-3xl mx-auto">
              {t("home.whyTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { titleKey: "reason1Title", stat: "25+", descKey: "reason1Desc" },
              { titleKey: "reason2Title", stat: "ISO", descKey: "reason2Desc" },
              { titleKey: "reason3Title", stat: "100%", descKey: "reason3Desc" },
            ].map((s, i) => (
              <div
                key={s.titleKey}
                className="group relative bg-surface-container-low border border-outline-variant rounded-2xl p-8 md:p-10 hover:border-primary/30 transition-colors duration-300"
              >
                <div className="flex flex-col gap-6">
                  <span className="font-display-lg text-[clamp(2.5rem,4vw,4rem)] text-primary leading-none">
                    {s.stat}
                  </span>
                  <div>
                    <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">{t(`home.${s.titleKey}`)}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{t(`home.${s.descKey}`)}</p>
                  </div>
                  <span className="font-data-mono text-data-mono text-[11px] text-on-surface-variant/40 uppercase tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={marqueeRef} className="py-16 md:py-20 bg-surface-container-highest overflow-hidden border-y border-outline-variant">
        <div className="flex marquee-track gap-12 items-center whitespace-nowrap">
          {partners.map((p, i) => (
            <span key={i} className="font-data-mono text-data-mono text-on-surface-variant/50 uppercase tracking-[0.2em] text-sm flex-shrink-0">
              {p}
            </span>
          ))}
        </div>
      </section>

      <section ref={ctaRef} className="py-32 md:py-48 bg-on-background relative overflow-hidden">
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
    </main>
  );
}
