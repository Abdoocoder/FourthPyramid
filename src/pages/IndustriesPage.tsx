import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../lib/usePageTitle";
import { ArrowRight } from "lucide-react";
import { industries } from "../lib/constants";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useScrollReveal } from "../lib/animations";

const bgClasses = ["bg-surface-container", "bg-surface", "bg-surface-container", "bg-surface"];

const industryImages = [
  "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80&auto=format",
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={className}>{children}</section>;
}

export function IndustriesPage() {
  const { t } = useTranslation();
  usePageTitle(t("nav.industries"));
  const headerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useScrollReveal(headerRef, ".reveal", 0.15);

  return (
    <>
      <section ref={headerRef} className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-24 pb-8 md:pb-16">
        <div className="max-w-3xl">
          <span className="reveal font-data-mono text-data-mono text-primary uppercase tracking-widest mb-4 block">{t("industries.eyebrow")}</span>
          <h1 className="reveal font-display-lg text-[clamp(1.8rem,4vw,3rem)] md:text-display-lg text-on-surface mb-6 leading-[1.1]">
            {t("industries.title")}
          </h1>
          <p className="reveal font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {t("industries.desc")}
          </p>
        </div>
      </section>

      {industries.map((ind, i) => {
        const imgUrl = industryImages[i] ?? ind.image;
        const title = t(`industries.items.${i}.title`);
        const eyebrow = t(`industries.items.${i}.eyebrow`);
        const description = t(`industries.items.${i}.description`);
        return (
        <AnimatedSection
          key={ind.title}
          className={`py-16 md:py-20 ${bgClasses[i]}`}
        >
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
              {ind.imageFirst ? (
                <>
                  <div className="reveal md:col-span-7 mb-8 md:mb-0">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container border border-outline-variant relative">
                      <img
                        src={imgUrl}
                        alt={title}
                        className="w-full h-full object-cover opacity-70 dark:opacity-40"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="reveal md:col-span-5 md:ps-8">
                    <Badge variant="primary" className="mb-4">{eyebrow}</Badge>
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-4">{title}</h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">{description}</p>
                    <Button as="a" href="/products" variant="tertiary">
                      {t("industries.viewProducts")} <ArrowRight className="w-4 h-4 rtl:rotate-180 rtl:mr-1 ltr:ml-1" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="reveal md:col-span-5 order-2 md:order-1">
                    <Badge variant="primary" className="mb-4">{eyebrow}</Badge>
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-4">{title}</h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">{description}</p>
                    <Button as="a" href="/products" variant="tertiary">
                      {t("industries.viewProducts")} <ArrowRight className="w-4 h-4 rtl:rotate-180 rtl:mr-1 ltr:ml-1" />
                    </Button>
                  </div>
                  <div className="reveal md:col-span-7 order-1 md:order-2 mb-8 md:mb-0">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container border border-outline-variant relative">
                      <img
                        src={imgUrl}
                        alt={title}
                        className="w-full h-full object-cover opacity-70 dark:opacity-40"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </AnimatedSection>
          );
        })}

      <section ref={ctaRef} className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-section-gap">
        <div className="bg-surface-container-high border border-outline-variant rounded-xl p-8 md:p-16 text-center">
          <h2 className="reveal font-display-lg text-[clamp(1.6rem,4vw,2.8rem)] text-on-surface mb-4 leading-[1.1]">
            {t("industries.ctaTitle")}
          </h2>
          <p className="reveal font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
            {t("industries.ctaDesc")}
          </p>
          <div className="reveal">
            <Button as="a" href="/request-quote" size="lg" variant="tertiary">
              {t("industries.ctaButton")} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
