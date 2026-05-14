import { useEffect, useRef, useCallback } from "react";
import { Upload, Loader } from "lucide-react";
import { cloudName, uploadPreset } from "../../lib/cloudinary";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  disabled?: boolean;
}

export function CloudinaryUpload({ onUpload, disabled }: CloudinaryUploadProps) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
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
            window: "#FBFCFE",
            windowBorder: "#E1E8ED",
            tabIcon: "#4A90E2",
            menuIcons: "#4A90E2",
            textDark: "#1A2B48",
            textLight: "#F7FBFF",
            link: "#4A90E2",
            action: "#4A90E2",
            inactiveTabIcon: "#7A7A7A",
            error: "#BA1A1A",
            inProgress: "#4A90E2",
            complete: "#4A90E2",
            sourceBg: "#F4F7F9",
          },
        },
      },
      (error: unknown, result: CloudinaryWidgetResult) => {
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
      aria-label="Upload image"
      className="w-28 h-28 rounded-lg border-2 border-dashed border-outline-variant bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary-container/25 transition-[background-color,border-color,color] duration-150 ease-out-strong disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {disabled ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
    </button>
  );
}
