import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { localized, localizedSpecs } from "../../lib/localized";

export function AdminProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const queryArgs = useMemo(() => ({ searchQuery: search || undefined }), [search]);
  const productsData = useQuery(api.products.list, queryArgs);
  const deleteProduct = useMutation(api.products.remove);

  const handleDelete = (id: Id<"products">, name: string) => {
    if (window.confirm(t("admin.confirmDelete", { name }))) {
      deleteProduct({ id });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">{t("admin.products")}</h1>
        <Button size="sm" onClick={() => navigate("/admin/products/new")}>
          <Plus className="w-4 h-4" /> {t("admin.addProduct")}
        </Button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          placeholder={t("admin.searchProducts")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 min-h-11 border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-sm text-[16px]"
        />
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl overflow-x-auto" aria-live="polite">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="text-left px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase">{t("admin.product")}</th>
              <th className="text-left px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase hidden md:table-cell">{t("admin.category")}</th>
              <th className="text-left px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase hidden sm:table-cell">{t("admin.material")}</th>
              <th className="text-right px-6 py-4 font-data-mono text-data-mono text-on-surface-variant uppercase">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {productsData === undefined ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center font-body-sm text-body-sm text-on-surface-variant animate-pulse">{t("products.loading")}</td></tr>
            ) : productsData.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center font-body-sm text-body-sm text-on-surface-variant">{t("admin.noProducts")}</td></tr>
            ) : (
              productsData.map((p) => (
              <tr key={p._id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4">
                  <span className="font-body-sm text-body-sm font-medium text-on-surface truncate max-w-[200px] block">{localized(p, "name")}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{localized(p, "category")}</span>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{localizedSpecs(p.specs, p.specs_ar).material}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-3 text-on-surface-variant hover:text-primary transition-colors rounded-lg" title={t("admin.edit")} aria-label={t("admin.edit")} onClick={() => navigate(`/admin/products/edit/${p._id}`)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-3 text-on-surface-variant hover:text-error transition-colors rounded-lg" title={t("admin.delete")} aria-label={t("admin.delete")} onClick={() => handleDelete(p._id, localized(p, "name"))}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
