import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Save, Upload, X, Loader } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button } from "../../components/ui/Button";
import { Input, Textarea, Select } from "../../components/ui/Input";

const specKeys = ["capacity", "material", "dimensions", "weight", "closureType", "unCertification", "colorsAvailable", "palletQuantity"] as const;

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function AdminProductFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const productId = id as Id<"products"> | undefined;
  const existingProduct = useQuery(api.products.getById, productId ? { id: productId } : "skip");
  const categoriesData = useQuery(api.categories.list);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const storeImage = useMutation(api.images.storeImage);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    name_ar: "",
    slug: "",
    description: "",
    description_ar: "",
    categoryId: "",
    featured: false,
    capacity: "",
    material: "",
    dimensions: "",
    weight: "",
    closureType: "",
    unCertification: "",
    colorsAvailable: "",
    palletQuantity: "",
    capacity_ar: "",
    material_ar: "",
    dimensions_ar: "",
    weight_ar: "",
    closureType_ar: "",
    unCertification_ar: "",
    colorsAvailable_ar: "",
    palletQuantity_ar: "",
    useCases: "",
    useCases_ar: "",
    certifications: "",
    certifications_ar: "",
    images: [] as string[],
  });

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct.name,
        name_ar: existingProduct.name_ar ?? "",
        slug: existingProduct.slug,
        description: existingProduct.description,
        description_ar: existingProduct.description_ar ?? "",
        categoryId: existingProduct.categoryId,
        featured: existingProduct.featured,
        capacity: existingProduct.specs.capacity,
        material: existingProduct.specs.material,
        dimensions: existingProduct.specs.dimensions,
        weight: existingProduct.specs.weight,
        closureType: existingProduct.specs.closureType,
        unCertification: existingProduct.specs.unCertification,
        colorsAvailable: existingProduct.specs.colorsAvailable,
        palletQuantity: existingProduct.specs.palletQuantity,
        capacity_ar: existingProduct.specs_ar?.capacity ?? "",
        material_ar: existingProduct.specs_ar?.material ?? "",
        dimensions_ar: existingProduct.specs_ar?.dimensions ?? "",
        weight_ar: existingProduct.specs_ar?.weight ?? "",
        closureType_ar: existingProduct.specs_ar?.closureType ?? "",
        unCertification_ar: existingProduct.specs_ar?.unCertification ?? "",
        colorsAvailable_ar: existingProduct.specs_ar?.colorsAvailable ?? "",
        palletQuantity_ar: existingProduct.specs_ar?.palletQuantity ?? "",
        useCases: existingProduct.useCases.join(", "),
        useCases_ar: (existingProduct.useCases_ar ?? []).join(", "),
        certifications: existingProduct.certifications.join(", "),
        certifications_ar: (existingProduct.certifications_ar ?? []).join(", "),
        images: existingProduct.images,
      });
    }
  }, [existingProduct]);

  const update = (key: string, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, { method: "POST", body: file });
      const { storageId } = await result.json();
      const url = await storeImage({ storageId });
      if (url) update("images", [...form.images, url]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) =>
    update("images", form.images.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        name_ar: form.name_ar || undefined,
        slug: form.slug || toSlug(form.name),
        description: form.description,
        description_ar: form.description_ar || undefined,
        images: form.images,
        categoryId: form.categoryId as any,
        specs: {
          capacity: form.capacity,
          material: form.material,
          dimensions: form.dimensions,
          weight: form.weight,
          closureType: form.closureType,
          unCertification: form.unCertification,
          colorsAvailable: form.colorsAvailable,
          palletQuantity: form.palletQuantity,
        },
        specs_ar: form.capacity_ar ? {
          capacity: form.capacity_ar,
          material: form.material_ar,
          dimensions: form.dimensions_ar,
          weight: form.weight_ar,
          closureType: form.closureType_ar,
          unCertification: form.unCertification_ar,
          colorsAvailable: form.colorsAvailable_ar,
          palletQuantity: form.palletQuantity_ar,
        } : undefined,
        useCases: form.useCases.split(",").map((s) => s.trim()).filter(Boolean),
        useCases_ar: form.useCases_ar ? form.useCases_ar.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        certifications: form.certifications.split(",").map((s) => s.trim()).filter(Boolean),
        certifications_ar: form.certifications_ar ? form.certifications_ar.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        featured: form.featured,
      };

      if (isEdit && productId) {
        await updateProduct({ id: productId, ...payload });
      } else {
        await createProduct(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const renderSpecFields = (prefix: string, label: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {specKeys.map((key) => (
        <Input
          key={`${prefix}${key}`}
          label={`${label} ${key.replace(/([A-Z])/g, " $1").trim()}`}
          id={`${prefix}${key}`}
          value={(form as any)[`${prefix}${key}`] ?? ""}
          onChange={(e) => update(`${prefix}${key}`, e.target.value)}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/admin/products")} className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-headline-md text-headline-md text-on-surface">
          {isEdit ? t("admin.editProduct") : t("admin.addProduct")}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl">
        <section className="bg-surface border border-outline-variant rounded-xl p-6 md:p-8 space-y-6">
          <h2 className="font-headline-md text-headline-md text-on-surface pb-2 border-b border-outline-variant">{t("admin.basicInfo")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label={t("admin.productName")} id="name" value={form.name} onChange={(e) => { update("name", e.target.value); if (!isEdit) update("slug", toSlug(e.target.value)); }} required />
            <Input label={t("admin.productNameAr")} id="name_ar" value={form.name_ar} onChange={(e) => update("name_ar", e.target.value)} />
          </div>
          <Input label="Slug" id="slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textarea label={t("admin.description")} id="description" value={form.description} onChange={(e) => update("description", e.target.value)} required />
            <Textarea label={t("admin.descriptionAr")} id="description_ar" value={form.description_ar} onChange={(e) => update("description_ar", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label={t("admin.category")} id="categoryId" value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} required>
              <option value="">{t("admin.selectCategory")}</option>
              {(categoriesData ?? []).map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </Select>
            <label className="flex items-center gap-3 pt-6">
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="w-4 h-4 accent-primary" />
              <span className="font-body-sm text-body-sm text-on-surface">{t("admin.featuredProduct")}</span>
            </label>
          </div>
        </section>

        <section className="bg-surface border border-outline-variant rounded-xl p-6 md:p-8 space-y-6">
          <h2 className="font-headline-md text-headline-md text-on-surface pb-2 border-b border-outline-variant">{t("admin.images")}</h2>
          <div className="flex flex-wrap gap-4">
            {form.images.map((url, i) => (
              <div key={i} className="relative w-28 h-28 rounded-lg border border-outline-variant overflow-hidden group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-error text-on-error rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-28 h-28 rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors">
              {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </section>

        <section className="bg-surface border border-outline-variant rounded-xl p-6 md:p-8 space-y-6">
          <h2 className="font-headline-md text-headline-md text-on-surface pb-2 border-b border-outline-variant">{t("admin.specifications")}</h2>
          {renderSpecFields("", t("admin.english"))}
          <div className="pt-4 border-t border-outline-variant">
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{t("admin.arabic")}</p>
            {renderSpecFields("", t("admin.arabic"))}
          </div>
        </section>

        <section className="bg-surface border border-outline-variant rounded-xl p-6 md:p-8 space-y-6">
          <h2 className="font-headline-md text-headline-md text-on-surface pb-2 border-b border-outline-variant">{t("admin.useCasesCertifications")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label={t("admin.useCases") + " (EN)"} id="useCases" value={form.useCases} onChange={(e) => update("useCases", e.target.value)} placeholder="Comma separated" />
            <Input label={t("admin.useCases") + " (AR)"} id="useCases_ar" value={form.useCases_ar} onChange={(e) => update("useCases_ar", e.target.value)} placeholder="مفصولة بفواصل" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label={t("admin.certifications") + " (EN)"} id="certifications" value={form.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="Comma separated" />
            <Input label={t("admin.certifications") + " (AR)"} id="certifications_ar" value={form.certifications_ar} onChange={(e) => update("certifications_ar", e.target.value)} placeholder="مفصولة بفواصل" />
          </div>
        </section>

        <div className="flex items-center gap-4 pt-4 border-t border-outline-variant">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t("admin.saveProduct")}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/admin/products")}>
            {t("admin.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
