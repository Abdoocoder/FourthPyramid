import { useEffect, useRef, useCallback } from "react";
import { Upload, Loader } from "lucide-react";
import { cloudName, uploadPreset } from "../../lib/cloudinary";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  disabled?: boolean;
}

export function CloudinaryUpload({ onUpload, disabled }: CloudinaryUploadProps) {
  const widgetRef = useRef<any>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);
    loaded.current = true;
    return () => {
      if (widgetRef.current) widgetRef.current.close();
    };
  }, []);

  const openWidget = useCallback(() => {
    if (!window.cloudinary) return;
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "camera", "url"],
        multiple: false,
        maxFileSize: 5 * 1024 * 1024,
        folder: "fourth-pyramid",
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        theme: "minimal",
        styles: {
          palette: {
            window: "#ffffff",
            windowBorder: "#c4c6d0",
            tabIcon: "#2F5FA7",
            menuIcons: "#2F5FA7",
            textDark: "#1E1E1E",
            textLight: "#ffffff",
            link: "#2F5FA7",
            action: "#2F5FA7",
            inactiveTabIcon: "#7A7A7A",
            error: "#ba1a1a",
            inProgress: "#2F5FA7",
            complete: "#2F5FA7",
            sourceBg: "#f2f4f8",
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onUpload(result.info.secure_url);
        }
      }
    );
    widgetRef.current.open();
  }, [onUpload]);

  return (
    <button
      type="button"
      onClick={openWidget}
      disabled={disabled}
      className="w-28 h-28 rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors disabled:opacity-50"
    >
      {disabled ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
    </button>
  );
}
