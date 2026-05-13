import { useTranslation } from "react-i18next";
import { Package, MessageSquare, TrendingUp } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function DashboardPage() {
  const { t } = useTranslation();
  const productsData = useQuery(api.products.list, {});
  const pendingQuotes = useQuery(api.quotes.list, { status: "pending" });

  const totalQuotes = useQuery(api.quotes.list, {});

  const stats = [
    { label: t("admin.products"), value: String(productsData?.length ?? "—"), icon: Package, color: "text-primary bg-primary-container" },
    { label: t("admin.pending"), value: String(pendingQuotes?.length ?? "—"), icon: MessageSquare, color: "text-tertiary bg-tertiary-container" },
    { label: t("admin.totalQuotes"), value: String(totalQuotes?.length ?? "—"), icon: TrendingUp, color: "text-secondary bg-secondary-container" },
  ];

  return (
    <div>
      <h1 className="font-headline-md text-headline-md text-on-surface mb-8">{t("admin.dashboard")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-surface border border-outline-variant rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{s.label}</p>
                  <p className="font-headline-md text-2xl font-bold text-on-surface">{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl p-6">
        <h2 className="font-headline-md text-xl text-on-surface mb-4">{t("admin.recentActivity")}</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {productsData === undefined ? t("productDetails.loading") : t("admin.connected")}
        </p>
      </div>
    </div>
  );
}
