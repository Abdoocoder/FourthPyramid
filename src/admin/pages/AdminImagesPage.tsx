import { useTranslation } from "react-i18next";
import { Upload, Trash2, Copy } from "lucide-react";
import { Button } from "../../components/ui/Button";

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
        <Button size="sm">
          <Upload className="w-4 h-4" /> {t("admin.uploadImages")}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sampleImages.map((url, i) => (
          <div key={i} className="group relative bg-surface-container-highest border border-outline-variant rounded-xl overflow-hidden aspect-square">
            <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-on-background/0 group-hover:bg-on-background/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button className="p-2 bg-surface rounded-lg text-on-surface hover:text-primary transition-colors" title={t("admin.copyUrl")}>
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 bg-surface rounded-lg text-on-surface hover:text-error transition-colors" title={t("admin.delete")}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
