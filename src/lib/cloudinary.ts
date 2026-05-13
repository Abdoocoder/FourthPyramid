export const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
export const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "";

export function cldTransform(url: string, transforms: string): string {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace("/image/upload/", `/image/upload/${transforms}/`);
}
