interface CloudinaryWidgetResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
  };
}

interface CloudinaryWidget {
  open: () => void;
  close: () => void;
}

interface Cloudinary {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result: CloudinaryWidgetResult) => void
  ) => CloudinaryWidget;
}

interface Window {
  cloudinary?: Cloudinary;
}
