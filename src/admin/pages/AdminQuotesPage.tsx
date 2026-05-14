import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, ChevronDown } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

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

const STATUS_ORDER = ["pending", "contacted", "closed"] as const;
type Status = typeof STATUS_ORDER[number];

function StatusButton({
  current,
  target,
  onUpdate,
}: {
  current: Status;
  target: Status;
  onUpdate: (s: Status) => void;
}) {
  const { t } = useTranslation();
  const active = current === target;
  return (
    <button
      onClick={() => !active && onUpdate(target)}
      disabled={active}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-data-mono uppercase tracking-wider transition-colors duration-150 ${
        active
          ? `${statusStyles[target]} opacity-100 cursor-default`
          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDotColors[target]}`} aria-hidden="true" />
      {t(`admin.${target}`)}
    </button>
  );
}

function QuoteRow({ q, expanded, onToggle }: {
  q: { _id: Id<"quotes">; companyName: string; contactName: string; email: string; phone: string; productType: string; quantity: string; message: string; status: Status };
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const updateStatus = useMutation(api.quotes.updateStatus);

  const handleStatus = (status: Status) => {
    updateStatus({ id: q._id, status });
  };

  return (
    <>
      <tr
        className={`border-b border-outline-variant transition-colors duration-150 ${expanded ? "bg-surface-container-low" : "hover:bg-surface-container-low"}`}
      >
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
          <button
            onClick={onToggle}
            aria-expanded={expanded}
            className={`p-3 transition-colors rounded-lg ${expanded ? "text-primary bg-primary-container/40" : "text-on-surface-variant hover:text-primary"}`}
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-outline-variant bg-surface-container-low/60">
          <td colSpan={5} className="px-6 py-5">
            <div className="detail-panel">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <div>
                  <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{t("contact.email")}</p>
                  <a href={`mailto:${q.email}`} className="font-body-sm text-body-sm text-primary hover:underline">{q.email}</a>
                </div>
                <div>
                  <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{t("contact.phone")}</p>
                  <a href={`tel:${q.phone}`} className="font-body-sm text-body-sm text-on-surface">{q.phone}</a>
                </div>
                {q.quantity && (
                  <div>
                    <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{t("quote.estimatedQuantity")}</p>
                    <span className="font-body-sm text-body-sm text-on-surface">{q.quantity}</span>
                  </div>
                )}
              </div>
              {q.message && (
                <div className="mb-5">
                  <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">{t("contact.message")}</p>
                  <p className="font-body-sm text-body-sm text-on-surface bg-surface border border-outline-variant rounded-lg px-4 py-3 whitespace-pre-wrap">{q.message}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest me-2">{t("admin.status")}</span>
                {STATUS_ORDER.map((s) => (
                  <StatusButton key={s} current={q.status} target={s} onUpdate={handleStatus} />
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function csvEscape(value: string | undefined): string {
  const s = (value ?? "").replace(/"/g, '""');
  return `"${s}"`;
}

export function AdminQuotesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Status | undefined>(undefined);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const quotesData = useQuery(api.quotes.list, { status: filter });

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  const handleExport = () => {
    if (!quotesData || quotesData.length === 0) return;
    const headers = ["Company", "Contact Name", "Email", "Phone", "Product Type", "Quantity", "Message", "Status"];
    const rows = quotesData.map((q) => [
      csvEscape(q.companyName),
      csvEscape(q.contactName),
      csvEscape(q.email),
      csvEscape(q.phone),
      csvEscape(q.productType),
      csvEscape(q.quantity),
      csvEscape(q.message),
      csvEscape(q.status),
    ].join(","));
    // UTF-8 BOM so Excel opens Arabic text correctly
    const csv = "﻿" + [headers.map(csvEscape).join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quotes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">{t("admin.quotes")}</h1>
        <button
          onClick={handleExport}
          disabled={!quotesData || quotesData.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> {t("admin.exportCsv")}
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(["all", "pending", "contacted", "closed"] as const).map((s) => (
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
                <QuoteRow
                  key={q._id}
                  q={q as Parameters<typeof QuoteRow>[0]["q"]}
                  expanded={expandedId === q._id}
                  onToggle={() => toggle(q._id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
