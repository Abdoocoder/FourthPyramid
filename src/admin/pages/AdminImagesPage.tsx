import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Copy } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { CloudinaryUpload } from "../../components/ui/CloudinaryUpload";
import type { Id } from "@convex/_generated/dataModel";

export function AdminImagesPage() {
  const { t } = useTranslation();
  const images = useQuery(api.gallery.list);
  const addImage = useMutation(api.gallery.add);
  const deleteImage = useMutation(api.gallery.remove);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<Id<"gallery"> | null>(null);

  const handleUpload = async (url: string) => {
    setUploading(true);
    try {
      await addImage({ url });
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (url: string, id: Id<"gallery">) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const handleDelete = async (id: Id<"gallery">) => {
    if (window.confirm(t("admin.confirmDeleteImage"))) {
      await deleteImage({ id });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">{t("admin.imageGallery")}</h1>
        <CloudinaryUpload onUpload={handleUpload} disabled={uploading} />
      </div>

      {images === undefined ? (
        <div className="text-center py-20 animate-pulse text-on-surface-variant">{t("products.loading")}</div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-body-lg text-body-lg text-on-surface-variant">{t("admin.noImages")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 grid-stagger">
          {images.map((img) => (
            <div key={img._id} className={`relative bg-surface-container-highest border border-outline-variant rounded-xl overflow-hidden aspect-square group ${copiedId === img._id ? "copy-flash" : ""}`}>
              <img src={img.url} alt={t("admin.galleryImage", { index: images.indexOf(img) + 1 })} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-on-background/0 group-hover:bg-on-background/30 transition-colors" />
            <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <button
                  className="p-3 bg-surface rounded-lg text-on-surface hover:text-primary transition-colors shadow-sm"
                    title={t("admin.copyUrl")}
                    aria-label={t("admin.copyUrl")}
                    onClick={() => handleCopy(img.url, img._id)}
                  >
                    {copiedId === img._id ? <span className="w-4 h-4 text-[10px] font-semibold">OK</span> : <Copy className="w-4 h-4" />}
                  </button>
                <button
                  className="p-3 bg-surface rounded-lg text-on-surface hover:text-error transition-colors shadow-sm"
                  title={t("admin.delete")}
                    aria-label={t("admin.delete")}
                    onClick={() => handleDelete(img._id)}
                  >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
