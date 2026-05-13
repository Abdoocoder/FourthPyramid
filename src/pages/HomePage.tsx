import { useTranslation } from "react-i18next";
import { ArrowRight, Factory, Package, FlaskConical, Fuel } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { localized } from "../lib/localized";

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

export function HomePage() {
  const { t } = useTranslation();
  const cats = useQuery(api.categories.list);

  return (
    <>
      <section className="bg-surface-container-highest text-on-surface min-h-[85dvh] flex items-center overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.08]">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80&auto=format')] bg-cover bg-center mix-blend-multiply" />
        </div>
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7">
              <span className="font-data-mono text-data-mono text-primary uppercase tracking-[0.15em] mb-6 block">
                {t("home.heroEyebrow")}
              </span>
              <h1 className="font-display-lg text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] mb-6 max-w-4xl">
                {t("home.heroTitle")}
                <span className="text-primary block">{t("home.heroTitleAccent")}</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
                {t("home.heroDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  as="a"
                  href="/request-quote"
                  size="lg"
                  variant="tertiary"
                >
                  {t("home.requestQuote")} <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  as="a"
                  href="/products"
                  variant="secondary"
                  size="lg"
                >
                  {t("home.viewProducts")}
                </Button>
              </div>
            </div>
            <div className="md:col-span-5 hidden md:flex items-end justify-end">
              <div className="relative w-full aspect-[3/4] max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80&auto=format"
                  alt="Industrial plastic jerrycan product"
                  className="w-full h-full object-cover rounded-2xl"
                  loading="eager"
                />
                <div className="absolute -bottom-4 -left-4 bg-on-background text-surface border border-outline rounded-xl px-5 py-3">
                  <span className="font-data-mono text-data-mono text-primary-fixed-dim">{t("common.isoBadge")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-inverse-surface text-inverse-on-surface border-y border-outline">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 divide-x divide-outline">
          {metrics.map((m) => (
            <div key={m.key} className="py-8 md:py-10 px-6 text-center">
              <span className="font-display-lg text-[clamp(1.5rem,3vw,2.5rem)] text-inverse-on-surface block leading-none mb-2">
                {m.value}
              </span>
              <span className="font-data-mono text-data-mono text-primary-fixed-dim uppercase tracking-[0.1em] text-[11px]">
                {t(`home.${m.key}`)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface text-on-surface py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-16">
            <div className="md:col-span-5">
              <span className="font-data-mono text-data-mono text-primary uppercase tracking-[0.15em] mb-4 block">{t("home.capabilitiesEyebrow")}</span>
              <h2 className="font-display-lg text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
                {t("home.capabilitiesTitle")}
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                {t("home.capabilitiesDesc")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {(cats ?? []).map((cat, i) => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} className={`block group hover-lift ${i === 0 ? "md:col-span-2" : ""}`}>
                <Card
                  className={`border-2 border-outline-variant hover:border-primary bg-surface transition-all duration-300 flex flex-col sm:flex-row ${i === 0 ? "md:flex-row" : ""}`}
                  hover={false}
                >
                  <div className={`${i === 0 ? "md:w-2/5" : "sm:w-1/3"} bg-surface-container p-8 md:p-10 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-outline-variant`}>
                    <div className="text-primary">
                      {iconMap[cat.icon]}
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">{localized(cat, "name")}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{localized(cat, "description")}</p>
                    <span className="font-data-mono text-data-mono text-primary uppercase tracking-wider text-[11px] group-hover:underline underline-offset-4 inline-flex items-center gap-1">
                      {t("home.exploreRange")} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-inverse-surface text-inverse-on-surface py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <span className="font-data-mono text-data-mono text-primary-fixed-dim uppercase tracking-[0.15em] mb-4 block">{t("home.whyEyebrow")}</span>
            <h2 className="font-display-lg text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
              {t("home.whyTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { titleKey: "reason1Title", stat: "25+", descKey: "reason1Desc" },
              { titleKey: "reason2Title", stat: "ISO", descKey: "reason2Desc" },
              { titleKey: "reason3Title", stat: "100%", descKey: "reason3Desc" },
            ].map((s, i) => (
              <div
                key={s.titleKey}
                className="border border-outline rounded-2xl p-8 md:p-10 flex flex-col gap-6 hover:border-primary-fixed-dim/40 transition-colors duration-200 hover-lift"
              >
                <span className="font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-primary-fixed-dim leading-none">
                  {s.stat}
                </span>
                <div>
                  <h3 className="font-headline-md text-xl font-bold mb-2">{t(`home.${s.titleKey}`)}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant/80 leading-relaxed">{t(`home.${s.descKey}`)}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-outline">
                  <span className="font-data-mono text-data-mono text-[11px] text-primary-fixed-dim uppercase tracking-wider">
                    0{i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-tertiary-container text-on-tertiary-container py-20 md:py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-5xl mx-auto text-center">
          <span className="font-data-mono text-data-mono text-on-tertiary-container/50 uppercase tracking-[0.15em] mb-4 block">
            {t("home.ctaEyebrow")}
          </span>
          <h2 className="font-display-lg text-[clamp(2rem,5vw,4rem)] text-on-tertiary-container mb-6 leading-[0.95] tracking-[-0.02em]">
            {t("home.ctaTitle")}
          </h2>
          <p className="font-body-lg text-body-lg text-on-tertiary-container/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("home.ctaDesc")}
          </p>
          <Button
            as="a"
            href="/request-quote"
            variant="primary"
            size="lg"
          >
            {t("home.ctaButton")} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
