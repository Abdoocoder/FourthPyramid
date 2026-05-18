import { useRef, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../lib/usePageTitle";
import {
  ArrowLeft,
  Download,
  FileText,
  FlaskConical,
  Sparkles,
  Fuel,
  Verified,
  ImageOff,
  ChevronRight,
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { SpecTable } from "../components/ui/SpecTable";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { localized, localizedArray, localizedSpecs } from "../lib/localized";
import { cldTransform } from "../lib/cloudinary";
import { useScrollReveal, usePageEntrance, useTiltCard } from "../lib/animations";
import gsap from "gsap";

function ProductImage({ src, alt, className, sizes }: { src: string | undefined; alt: string; className?: string; sizes?: string }) {
  if (!src) {
    return (
      <div className={`bg-surface-container-highest flex items-center justify-center ${className ?? ""}`}>
        <ImageOff className="w-12 h-12 text-outline opacity-40" />
      </div>
    );
  }
  return <img src={src} alt={alt} sizes={sizes} loading="lazy" className={className ?? ""} />;
}

const useCaseIcons: Record<string, React.ReactNode> = {
  Agrochemicals: <FlaskConical className="w-[18px] h-[18px] text-secondary" />,
  "Industrial Detergents": <Sparkles className="w-[18px] h-[18px] text-secondary" />,
  Lubricants: <Fuel className="w-[18px] h-[18px] text-secondary" />,
};

export function ProductDetailsPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const queryArgs = useMemo(() => ({ slug: slug ?? "" }), [slug]);
  const product = useQuery(api.products.getBySlug, queryArgs);
  usePageTitle(product ? localized(product, "name") : t("nav.products"));
  const [activeImage, setActiveImage] = useState(0);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  usePageEntrance(breadcrumbRef, ".pd-breadcrumb", { stagger: 0, delay: 0.05 });
  useScrollReveal(rightPanelRef, ".pd-panel-item", 0.12);
  useScrollReveal(specsRef, ".pd-specs");
  useTiltCard(mainImageRef, 6);

  const handleThumbClick = (i: number) => {
    if (i === activeImage || !mainImageRef.current) return;
    const el = mainImageRef.current;
    gsap.to(el, {
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setActiveImage(i);
        gsap.to(el, { opacity: 1, duration: 0.25, ease: "power2.out" });
      },
    });
  };

  if (product === undefined) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-7">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
          <div className="md:col-span-5 flex flex-col gap-5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="mt-auto space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-section-gap">
        <div className="max-w-md">
          <p className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-wider mb-4">404</p>
          <h1 className="font-display-lg text-[clamp(1.6rem,4vw,2.5rem)] text-on-surface mb-4 leading-[1.1]">
            {t("productDetails.productNotFound")}
          </h1>
          <Button as="a" href="/products" variant="primary">
            <ArrowLeft className="w-4 h-4" /> {t("productDetails.backToProducts")}
          </Button>
        </div>
      </div>
    );
  }

  const activeSpecs = localizedSpecs(product.specs, product.specs_ar);
  const specItems = Object.entries(activeSpecs).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, " $1").trim(),
    value,
  }));

  const images = product.images ?? [];

  return (
    <div className="pt-28 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div ref={breadcrumbRef} className="">
        <nav aria-label="Breadcrumb" className="pd-breadcrumb flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-8 flex-wrap">
          <Link to="/products" className="hover:text-primary transition-colors">{t("nav.products")}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-outline-variant rtl:rotate-180" />
          <Link to={`/products?category=${product.categorySlug}`} className="hover:text-primary transition-colors">
            {localized(product, "category")}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-outline-variant rtl:rotate-180" />
          <span className="text-on-surface font-semibold">{localized(product, "name")}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-16">
        <div className="md:col-span-7 flex flex-col gap-4">
          <div ref={mainImageRef} className="bg-surface-container-lowest border border-outline-variant rounded-xl relative overflow-hidden">
            <ProductImage
              src={cldTransform(images[activeImage], "w_800,q_auto,f_auto")}
              alt={localized(product, "name")}
              sizes="(max-width: 768px) 100vw, 58vw"
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="absolute top-4 start-4 bg-inverse-surface/90 text-inverse-on-surface px-3 py-1.5 rounded-md font-data-mono text-[11px] uppercase flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <Verified className="w-3.5 h-3.5" />
              {localizedArray(product.certifications, product.certifications_ar)[0]}
            </div>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleThumbClick(i)}
                  aria-label={`${localized(product, "name")}, image ${i + 1}`}
                  className={`aspect-square bg-surface-container border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                    i === activeImage
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-outline-variant hover:border-primary/50"
                  }`}
                >
                  <ProductImage
                    src={cldTransform(img, "w_200,h_200,c_fill,q_auto,f_auto")}
                    alt={`${localized(product, "name")} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="grid grid-cols-4 gap-3">
              <div className="aspect-square bg-surface-container border border-outline-variant rounded-xl overflow-hidden flex items-center justify-center">
                <FileText className="w-8 h-8 text-outline" />
              </div>
            </div>
          )}
        </div>

        <div ref={rightPanelRef} className="md:col-span-5 flex flex-col gap-8">
          <div className="pd-panel-item flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
              {localizedArray(product.certifications, product.certifications_ar).map((cert, i) => (
                <Badge key={i} variant={i === 0 ? "primary" : "outline"}>{cert}</Badge>
              ))}
            </div>
            <h1 className="font-display-lg text-[clamp(1.6rem,3vw,2.8rem)] text-on-background ltr:tracking-tight leading-[1.1]">
              {localized(product, "name")}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {localized(product, "description")}
            </p>
          </div>

          {localizedArray(product.useCases, product.useCases_ar).length > 0 && (
            <div className="pd-panel-item flex flex-col gap-3">
              <h2 className="font-headline-md text-sm font-semibold text-on-background uppercase tracking-wider">
                {t("productDetails.industrialApplications")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {localizedArray(product.useCases, product.useCases_ar).map((uc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 border border-outline-variant rounded-full px-3.5 py-1.5 font-body-sm text-body-sm text-on-surface"
                  >
                    {useCaseIcons[product.useCases[idx]] || <FlaskConical className="w-[16px] h-[16px] text-secondary" />}
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pd-panel-item flex flex-col gap-3 mt-auto pt-4 border-t border-outline-variant">
            <Button
              as="a"
              href={`/request-quote?product=${encodeURIComponent(localized(product, "name"))}`}
              size="lg"
              variant="tertiary"
              className="w-full justify-center"
            >
              <FileText className="w-4 h-4" />
              {t("productDetails.requestBulkQuote")}
            </Button>
            <Button variant="secondary" size="md" className="w-full justify-center" disabled aria-disabled="true">
              <Download className="w-4 h-4" />
              {t("productDetails.downloadSpecSheet")}
            </Button>
          </div>
        </div>
      </div>

      <div ref={specsRef} className="pd-specs max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-headline-md text-headline-md text-on-background">
            {t("productDetails.technicalSpecs")}
          </h2>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>
        <SpecTable specs={specItems} label={t("productDetails.technicalSpecs")} />
      </div>
    </div>
  );
}
