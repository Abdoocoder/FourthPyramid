import { useTranslation } from "react-i18next";
import { Package, MessageSquare, ArrowRight, Plus, FileText, Image } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { t } = useTranslation();
  const productsData = useQuery(api.products.list, {});
  const pendingQuotes = useQuery(api.quotes.list, { status: "pending" });
  const totalQuotes = useQuery(api.quotes.list, {});

  const stats = [
    { label: t("admin.products"), value: productsData?.length ?? null },
    { label: t("admin.pending"), value: pendingQuotes?.length ?? null },
    { label: t("admin.totalQuotes"), value: totalQuotes?.length ?? null },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-on-surface">{t("admin.dashboard")}</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">Fourth Pyramid Plastic Industries</p>
      </div>

      {/* Stats strip — not cards, just numbers */}
      <div className="grid grid-cols-3 divide-x divide-outline-variant border border-outline-variant rounded-xl bg-surface mb-6 overflow-hidden">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-5">
            <p className="text-2xl font-semibold text-on-surface tabular-nums">
              {s.value === null ? (
                <span className="text-outline-variant animate-pulse">—</span>
              ) : (
                s.value
              )}
            </p>
            <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pending quotes list */}
        <div className="md:col-span-2 bg-surface border border-outline-variant rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-on-surface-variant" />
              <span className="text-sm font-medium text-on-surface">{t("admin.pending")}</span>
              {pendingQuotes && pendingQuotes.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-semibold">
                  {pendingQuotes.length}
                </span>
              )}
            </div>
            <Link
              to="/admin/quotes"
              className="flex items-center gap-1 text-xs text-primary hover:text-on-primary-container transition-colors duration-150"
            >
              {t("admin.quotes")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {pendingQuotes === undefined ? (
            <div className="px-5 py-10 text-center text-sm text-on-surface-variant animate-pulse">
              {t("productDetails.loading")}
            </div>
          ) : pendingQuotes.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-on-surface-variant">{t("admin.connected")}</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {pendingQuotes.slice(0, 6).map((q) => (
                <div key={q._id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-on-tertiary-container">
                      {q.companyName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-on-surface truncate">{q.companyName}</p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {q.contactName} · {q.productType}
                    </p>
                  </div>
                  <Link
                    to="/admin/quotes"
                    className="shrink-0 text-xs font-medium text-primary hover:text-on-primary-container transition-colors duration-150"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-outline-variant">
            <span className="text-sm font-medium text-on-surface">Quick actions</span>
          </div>
          <div className="p-3 space-y-1">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors duration-150"
            >
              <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
                <Plus className="w-3.5 h-3.5 text-on-primary-container" />
              </div>
              <span className="font-medium">New product</span>
            </Link>
            <Link
              to="/admin/quotes"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors duration-150"
            >
              <div className="w-7 h-7 rounded-lg bg-tertiary-container flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5 text-on-tertiary-container" />
              </div>
              <span className="font-medium">Quote requests</span>
            </Link>
            <Link
              to="/admin/pages"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors duration-150"
            >
              <div className="w-7 h-7 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5 text-on-secondary-container" />
              </div>
              <span className="font-medium">Edit pages</span>
            </Link>
            <Link
              to="/admin/images"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors duration-150"
            >
              <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                <Image className="w-3.5 h-3.5 text-on-surface-variant" />
              </div>
              <span className="font-medium">Gallery</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
