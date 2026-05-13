import i18n from "i18next";

export function localized<T extends Record<string, unknown>>(
  item: T,
  fieldEn: "name" | "description" | "category"
): string {
  const isAr = i18n.language.startsWith("ar");
  const arKey = `${fieldEn}_ar`;
  if (isAr && typeof item[arKey] === "string") {
    return item[arKey] as string;
  }
  return (item[fieldEn] as string) ?? "";
}

export function localizedArray(
  arrEn: string[] | undefined,
  arrAr: string[] | undefined
): string[] {
  const isAr = i18n.language.startsWith("ar");
  if (isAr && arrAr && arrAr.length > 0) return arrAr;
  return arrEn ?? [];
}

export function localizedSpecs(
  specs: Record<string, string> | undefined,
  specsAr: Record<string, string> | undefined
): Record<string, string> {
  const isAr = i18n.language.startsWith("ar");
  if (isAr && specsAr) return specsAr;
  return specs ?? {};
}
