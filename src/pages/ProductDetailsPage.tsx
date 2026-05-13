import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Download,
  FileText,
  FlaskConical,
  Sparkles,
  Fuel,
  Verified,
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { SpecTable } from "../components/ui/SpecTable";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { localized, localizedArray, localizedSpecs } from "../lib/localized";
import { cldTransform } from "../lib/cloudinary";

const useCaseIcons: Record<string, React.ReactNode> = {
  Agrochemicals: <FlaskConical className="w-[18px] h-[18px] text-secondary" />,
  "Industrial Detergents": <Sparkles className="w-[18px] h-[18px] text-secondary" />,
  Lubricants: <Fuel className="w-[18px] h-[18px] text-secondary" />,
};

export function ProductDetailsPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const product = useQuery(api.products.getBySlug, { slug: slug ?? "" });

  if (product === undefined) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-section-gap text-center">
        <div className="animate-pulse text-on-surface-variant">{t("productDetails.loading")}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-section-gap text-center">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-4">{t("productDetails.productNotFound")}</h1>
        <Button as="a" href="/products" variant="primary">
          <ArrowLeft className="w-4 h-4" /> {t("productDetails.backToProducts")}
        </Button>
      </div>
    );
  }

  const activeSpecs = localizedSpecs(product.specs, product.specs_ar);
  const specItems = Object.entries(activeSpecs).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, " $1").trim(),
    value,
  }));

  return (
    <div className="pt-28 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter">
      <div className="md:col-span-12 flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-6">
        <Link to="/products" className="hover:text-primary transition-colors">{t("nav.products")}</Link>
        <span className="text-outline-variant">/</span>
        <Link to={`/products?category=${product.categorySlug}`} className="hover:text-primary transition-colors">
          {localized(product, "category")}
        </Link>
        <span className="text-outline-variant">/</span>
        <span className="text-on-surface font-semibold">{localized(product, "name")}</span>
      </div>

      <div className="md:col-span-7 flex flex-col gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl relative overflow-hidden">
          <img
            src={cldTransform(product.images[0], "w_800,q_auto,f_auto")}
            alt={localized(product, "name")}
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="absolute top-4 left-4 bg-on-background text-surface px-3 py-1 rounded-sm font-data-mono text-data-mono uppercase flex items-center gap-1.5 shadow-sm">
            <Verified className="w-3.5 h-3.5" />
            {localizedArray(product.certifications, product.certifications_ar)[0]}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.slice(0, 3).map((img, i) => (
            <div key={i} className="aspect-square bg-surface-container border border-outline-variant rounded-xl overflow-hidden cursor-pointer">
              <img src={cldTransform(img, "w_200,h_200,c_fill,q_auto,f_auto")} alt={`${localized(product, "name")} view ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
          <div className="aspect-square bg-surface-container border border-outline-variant rounded-xl overflow-hidden cursor-pointer flex items-center justify-center bg-surface-container-high">
            <FileText className="w-8 h-8 text-outline" />
          </div>
        </div>
      </div>

      <div className="md:col-span-5 flex flex-col gap-8">
        <div className="flex flex-col gap-4 border-b border-outline-variant pb-6">
          <div className="flex gap-2">
            <Badge variant="primary">{localizedArray(product.certifications, product.certifications_ar)[0]}</Badge>
            {localizedArray(product.certifications, product.certifications_ar)[1] && <Badge variant="outline">{localizedArray(product.certifications, product.certifications_ar)[1]}</Badge>}
          </div>
          <h1 className="font-display-lg text-[clamp(1.6rem,4vw,3rem)] text-on-background tracking-tight leading-[1.1]">
            {localized(product, "name")}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{localized(product, "description")}</p>
        </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-headline-md text-xl text-on-background">{t("productDetails.industrialApplications")}</h3>
            <div className="flex flex-wrap gap-2">
              {localizedArray(product.useCases, product.useCases_ar).map((uc, idx) => (
                <span
                  key={idx}
                  className="border border-outline-variant rounded-full px-4 py-1.5 font-body-sm text-body-sm text-on-surface flex items-center gap-2"
                >
                  {useCaseIcons[product.useCases[idx]] || <FlaskConical className="w-[18px] h-[18px] text-secondary" />}
                  {uc}
                </span>
              ))}
            </div>
          </div>

        <div className="flex flex-col gap-4 mt-auto">
          <Button as="a" href="/request-quote" size="lg" variant="tertiary" className="w-full justify-center">
            <FileText className="w-4 h-4" />
            {t("productDetails.requestBulkQuote")}
          </Button>
          <Button variant="secondary" size="md" className="w-full justify-center">
            <Download className="w-4 h-4" />
            {t("productDetails.downloadSpecSheet")}
          </Button>
        </div>
      </div>

      <div className="md:col-span-12 mt-section-gap">
        <h2 className="font-headline-md text-headline-md text-on-background mb-8 border-b border-outline-variant pb-4">
          {t("productDetails.technicalSpecs")}
        </h2>
        <SpecTable specs={specItems} />
      </div>
    </div>
  );
}
