import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

function ContactRow({
  c,
  expanded,
  onToggle,
}: {
  c: { _id: string; name: string; email: string; subject: string; message: string };
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <tr
        className={`border-b border-outline-variant transition-colors duration-150 ${expanded ? "bg-surface-container-low" : "hover:bg-surface-container-low"}`}
      >
        <td className="px-6 py-4">
          <span className="font-body-sm text-body-sm font-medium text-on-surface block truncate max-w-[160px]">{c.name}</span>
        </td>
        <td className="px-6 py-4 hidden sm:table-cell">
          <a href={`mailto:${c.email}`} className="font-body-sm text-body-sm text-primary hover:underline truncate max-w-[200px] block">{c.email}</a>
        </td>
        <td className="px-6 py-4 hidden md:table-cell">
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-[220px] block">{c.subject}</span>
        </td>
        <td className="px-6 py-4 text-end">
          <button
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse message" : "Read message"}
            className={`p-3 transition-colors rounded-lg ${expanded ? "text-primary bg-primary-container/40" : "text-on-surface-variant hover:text-primary"}`}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-outline-variant bg-surface-container-low/60">
          <td colSpan={4} className="px-6 py-5">
            <div className="detail-panel">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div>
                  <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{t("admin.name")}</p>
                  <span className="font-body-sm text-body-sm text-on-surface">{c.name}</span>
                </div>
                <div>
                  <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{t("contact.email")}</p>
                  <a href={`mailto:${c.email}`} className="font-body-sm text-body-sm text-primary hover:underline">{c.email}</a>
                </div>
                <div>
                  <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{t("contact.subject")}</p>
                  <span className="font-body-sm text-body-sm text-on-surface">{c.subject}</span>
                </div>
              </div>
              <div>
                <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">{t("contact.message")}</p>
                <p className="font-body-sm text-body-sm text-on-surface bg-surface border border-outline-variant rounded-lg px-4 py-3 whitespace-pre-wrap">{c.message}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function AdminContactsPage() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const contacts = useQuery(api.contacts.list);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">{t("admin.contacts")}</h1>
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl overflow-x-auto" aria-live="polite">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="text-start px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase">{t("admin.name")}</th>
              <th className="text-start px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase hidden sm:table-cell">{t("contact.email")}</th>
              <th className="text-start px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase hidden md:table-cell">{t("contact.subject")}</th>
              <th className="text-end px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {contacts === undefined ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center font-body-sm text-body-sm text-on-surface-variant animate-pulse">{t("admin.loading")}</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center font-body-sm text-body-sm text-on-surface-variant">{t("admin.noContacts")}</td></tr>
            ) : (
              contacts.map((c) => (
                <ContactRow
                  key={c._id}
                  c={c as Parameters<typeof ContactRow>[0]["c"]}
                  expanded={expandedId === c._id}
                  onToggle={() => toggle(c._id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
