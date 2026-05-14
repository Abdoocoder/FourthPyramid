import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, Eye } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const statusStyles: Record<string, string> = {
  pending: "bg-tertiary-container text-on-tertiary-container",
  contacted: "bg-primary-container text-on-primary-container",
  closed: "bg-surface-container-high text-on-surface-variant",
};

const statusDotColors: Record<string, string> = {
  pending: "bg-tertiary",
  contacted: "bg-primary",
  closed: "bg-outline",
};

export function AdminQuotesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const quotesData = useQuery(api.quotes.list, { status: filter as "pending" | "contacted" | "closed" | undefined });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">{t("admin.quotes")}</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors text-sm">
          <Download className="w-4 h-4" /> {t("admin.exportCsv")}
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "pending", "contacted", "closed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s === "all" ? undefined : s)}
            className={`px-5 py-3 min-h-11 rounded-lg font-button-label text-button-label whitespace-nowrap transition-colors ${
              (filter === undefined && s === "all") || filter === s
                ? "bg-primary text-on-primary"
                : "bg-surface-variant text-on-background border border-outline-variant hover:bg-outline-variant"
            }`}
          >
            {t(`admin.${s}`)}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl overflow-x-auto" aria-live="polite">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="text-start px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase">{t("admin.company")}</th>
              <th className="text-start px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase hidden md:table-cell">{t("admin.contact")}</th>
              <th className="text-start px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase hidden sm:table-cell">{t("admin.productType")}</th>
              <th className="text-start px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase">{t("admin.status")}</th>
              <th className="text-end px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {quotesData === undefined ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center font-body-sm text-body-sm text-on-surface-variant animate-pulse">{t("admin.loading")}</td></tr>
            ) : quotesData.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center font-body-sm text-body-sm text-on-surface-variant">{t("admin.noQuotes")}</td></tr>
            ) : (
              quotesData.map((q) => (
              <tr key={q._id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4">
                  <span className="font-body-sm text-body-sm font-medium text-on-surface block truncate max-w-[180px]">{q.companyName}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{q.contactName}</span>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{q.productType}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-data-mono uppercase tracking-wider ${statusStyles[q.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDotColors[q.status]}`} aria-hidden="true" />
                    {t(`admin.${q.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4 text-end">
                  <button className="p-3 text-on-surface-variant hover:text-primary transition-colors rounded-lg" title={t("admin.view")} aria-label={t("admin.view")}>
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
