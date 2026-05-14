import { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../lib/usePageTitle";
import { Search, ShoppingCart, ImageOff } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { localized, localizedArray, localizedSpecs } from "../lib/localized";
import { cldTransform } from "../lib/cloudinary";
import { usePageEntrance } from "../lib/animations";

export function ProductsPage() {
  const { t } = useTranslation();
  usePageTitle(t("nav.products"));
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const pageHeaderRef = useRef<HTMLDivElement>(null);

  usePageEntrance(pageHeaderRef, ".entrance", { stagger: 0.13, delay: 0.05 });

  const queryArgs = useMemo(
    () => ({
      searchQuery: searchQuery || undefined,
      categorySlug: activeCategory !== "all" ? activeCategory : undefined,
    }),
    [searchQuery, activeCategory]
  );
  const productsData = useQuery(api.products.list, queryArgs);
  const categoriesData = useQuery(api.categories.list);

  const filtered = productsData ?? [];

  return (
    <>
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-section-gap flex flex-col gap-8">
        <div ref={pageHeaderRef} className="flex flex-col gap-4 max-w-2xl">
          <h1 className="entrance font-display-lg text-[clamp(1.8rem,4vw,3rem)] md:text-display-lg text-on-background leading-[1.1]">
            {t("products.pageTitle")}
          </h1>
          <p className="entrance font-body-lg text-body-lg text-on-surface-variant">
            {t("products.pageDesc")}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-on-surface-variant" />
            </div>
            <input
              type="text"
              placeholder={t("products.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={t("products.searchPlaceholder")}
              className="block w-full ps-10 pe-3 py-3 border border-outline-variant rounded-xl bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary font-body-sm text-[16px] transition-shadow"
            />
          </div>

          <div className="flex overflow-x-auto pb-2 gap-3">
            <button
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
              className={`flex-shrink-0 px-5 py-3 min-h-11 rounded-lg font-button-label text-button-label whitespace-nowrap transition-colors ${
                activeCategory === "all"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-background border border-outline-variant hover:bg-outline-variant"
              }`}
            >
              {t("products.allProducts")}
            </button>
            {(categoriesData ?? []).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                aria-pressed={activeCategory === cat.slug}
                className={`flex-shrink-0 px-5 py-3 min-h-11 rounded-lg font-button-label text-button-label whitespace-nowrap transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-primary text-on-primary"
                    : "bg-surface-variant text-on-background border border-outline-variant hover:bg-outline-variant"
                }`}
              >
                {localized(cat, "name")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="sr-only">{t("products.allProducts")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" aria-live="polite" aria-label={t("products.productList")}>
          {filtered.length === 0 && productsData === undefined && (
            <div className="col-span-full py-20 text-center">
              <div className="animate-pulse text-on-surface-variant font-body-lg">{t("products.loading")}</div>
            </div>
          )}
          {filtered.length === 0 && productsData !== undefined && (
            <div className="col-span-full py-20 text-center">
              <p className="font-body-lg text-body-lg text-on-surface-variant">{t("products.noResults")}</p>
            </div>
          )}
          {filtered.map((product) => (
            <Card key={product._id} hover={false} className="stagger-item flex flex-col overflow-hidden group">
              <Link to={`/products/${product.slug}`} className="aspect-[4/3] bg-surface-container-highest relative overflow-hidden block">
                {product.images?.[0] ? (
                  <img
                    src={cldTransform(product.images[0], "w_400,q_auto,f_auto")}
                    alt={localized(product, "name")}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out-strong"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
                    <ImageOff className="w-8 h-8 text-outline opacity-30" />
                  </div>
                )}
                <div className="absolute top-2 start-2">
                  <Badge variant="secondary">{localizedArray(product.certifications, product.certifications_ar)[0]}</Badge>
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-headline-md text-xl text-on-background hover:text-primary transition-colors">
                      {localized(product, "name")}
                    </h3>
                  </Link>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-data-mono text-data-mono text-on-surface-variant uppercase w-24">{t("products.capacity")}</span>
                      <span className="font-body-sm text-body-sm text-on-background">{localizedSpecs(product.specs, product.specs_ar).capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-data-mono text-data-mono text-on-surface-variant uppercase w-24">{t("products.material")}</span>
                      <span className="font-body-sm text-body-sm text-on-background">{localizedSpecs(product.specs, product.specs_ar).material}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-data-mono text-data-mono text-on-surface-variant uppercase w-24">{t("products.usage")}</span>
                      <span className="font-body-sm text-body-sm text-on-background">{localizedArray(product.useCases, product.useCases_ar)[0]}</span>
                    </div>
                  </div>
                </div>
                <Button as="a" href={`/products/${product.slug}`} variant="tertiary" size="md" className="w-full">
                  <ShoppingCart className="w-4 h-4" />
                  {t("products.requestQuote")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        </div>
      </section>
    </>
  );
}
