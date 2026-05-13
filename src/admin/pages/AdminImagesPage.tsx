import { useTranslation } from "react-i18next";
import { Upload, Trash2, Copy } from "lucide-react";

const sampleImages = [
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
  "https://images.unsplash.com/photo-1581092335871-4c2c5d0a1b3e?w=400&q=80",
];

export function AdminImagesPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">{t("admin.imageGallery")}</h1>
        <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary text-on-primary font-button-label text-button-label hover:bg-primary-container hover:text-on-primary-container transition-colors">
          <Upload className="w-4 h-4" /> {t("admin.uploadImages")}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sampleImages.map((url, i) => (
          <div key={i} className="relative bg-surface-container-highest border border-outline-variant rounded-xl overflow-hidden aspect-square group">
            <img src={url} alt={t("admin.galleryImage", { index: i + 1 })} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-on-background/0 group-hover:bg-on-background/30 transition-colors" />
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <button
                className="p-2 bg-surface rounded-lg text-on-surface hover:text-primary transition-colors shadow-sm"
                title={t("admin.copyUrl")}
                aria-label={t("admin.copyUrl")}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                className="p-2 bg-surface rounded-lg text-on-surface hover:text-error transition-colors shadow-sm"
                title={t("admin.delete")}
                aria-label={t("admin.delete")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
