import { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../lib/usePageTitle";
import { Search, ShoppingCart, ImageOff } from "lucide-react";
import { Card } from "../components/ui/Card";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { localized } from "../lib/localized";
import { cldTransform } from "../lib/cloudinary";
import { usePageEntrance, useTiltCard } from "../lib/animations";
import { Skeleton } from "../components/ui/Skeleton";

function TiltWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useTiltCard(ref, 8);
  return <div ref={ref} className={className}>{children}</div>;
}

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
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-section-gap">
        <div ref={pageHeaderRef} className="flex flex-col gap-4 mb-10">
          <h1 className="entrance font-display-lg text-[clamp(1.8rem,4vw,3rem)] md:text-display-lg text-on-background leading-[1.1]">
            {t("products.pageTitle")}
          </h1>
          <p className="entrance font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {t("products.pageDesc")}
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-10">
          <div className="relative max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              placeholder={t("products.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={t("products.searchPlaceholder")}
              className="block w-full ps-10 pe-4 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary font-body-sm text-[16px] transition-[border-color,box-shadow] duration-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
              className={`px-4 py-2 min-h-11 rounded-full font-body-sm text-body-sm border transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                  : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/30 hover:text-on-surface"
              }`}
            >
              {t("products.allProducts")}
            </button>
            {(categoriesData ?? []).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                aria-pressed={activeCategory === cat.slug}
                className={`px-4 py-2 min-h-11 rounded-full font-body-sm text-body-sm border transition-all duration-200 ${
                  activeCategory === cat.slug
                    ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/30 hover:text-on-surface"
                }`}
              >
                {localized(cat, "name")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter" aria-live="polite" aria-label={t("products.productList")}>
          {filtered.length === 0 && productsData === undefined && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 border border-outline-variant rounded-xl">
                  <Skeleton className="w-28 h-28 shrink-0 rounded-lg" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-full mt-auto" />
                  </div>
                </div>
              ))}
            </>
          )}
          {filtered.length === 0 && productsData !== undefined && (
            <div className="col-span-full py-20 text-center">
              <p className="font-body-lg text-body-lg text-on-surface-variant">{t("products.noResults")}</p>
            </div>
          )}
          {filtered.map((product) => (
            <TiltWrapper key={product._id}>
              <Card
                hover
                className="flex gap-0 overflow-hidden group h-full"
              >
                <Link
                  to={`/products/${product.slug}`}
                  className="w-28 md:w-32 shrink-0 bg-surface-container-highest relative overflow-hidden"
                >
                  {product.images?.[0] ? (
                    <img
                      src={cldTransform(product.images[0], "w_240,h_240,c_fill,q_auto,f_auto")}
                      alt={localized(product, "name")}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out-strong group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
                      <ImageOff className="w-6 h-6 text-outline opacity-30" />
                    </div>
                  )}
                </Link>
                <div className="flex flex-col flex-1 p-4 gap-2 min-w-0">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-headline-md text-sm md:text-base text-on-background hover:text-primary transition-colors line-clamp-1">
                      {localized(product, "name")}
                    </h3>
                  </Link>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    {localized(product, "description")}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-low font-data-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {localized(product, "category")}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-low font-data-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {product.specs.material}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-low font-data-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {product.specs.capacity}
                    </span>
                  </div>
                  <Link
                    to={`/products/${product.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors mt-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {t("products.requestQuote")}
                  </Link>
                </div>
              </Card>
            </TiltWrapper>
          ))}
        </div>
      </section>
  );
}
