import { describe, it, expect, beforeEach } from "vitest";
import i18n from "i18next";
import { localized, localizedArray, localizedSpecs } from "../localized";

describe("localized", () => {
  beforeEach(() => {
    i18n.language = "en";
  });

  it("returns English field when language is en", () => {
    const obj = { name: "Container" };
    expect(localized(obj, "name")).toBe("Container");
  });

  it("returns Arabic field when language is ar", () => {
    i18n.language = "ar";
    const obj = { name: "Container", name_ar: "حاوية" };
    expect(localized(obj, "name")).toBe("حاوية");
  });

  it("falls back to English when Arabic field is missing", () => {
    i18n.language = "ar";
    const obj = { name: "Container" };
    expect(localized(obj, "name")).toBe("Container");
  });

  it("falls back to English when Arabic field is empty string", () => {
    i18n.language = "ar";
    const obj = { name: "Container", name_ar: "" as string | undefined };
    expect(localized(obj, "name")).toBe("Container");
  });

  it("falls back to English when Arabic field is undefined", () => {
    i18n.language = "ar";
    const obj = { name: "Container", name_ar: undefined };
    expect(localized(obj, "name")).toBe("Container");
  });

  it("returns empty string when English field missing", () => {
    const obj = {} as Record<string, unknown>;
    expect(localized(obj, "name")).toBe("");
  });
});

describe("localizedArray", () => {
  beforeEach(() => {
    i18n.language = "en";
  });

  it("returns English array when language is en", () => {
    const arrEn = ["Industrial", "Chemical"];
    const arrAr = ["صناعي", "كيميائي"];
    expect(localizedArray(arrEn, arrAr)).toEqual(["Industrial", "Chemical"]);
  });

  it("returns Arabic array when language is ar", () => {
    i18n.language = "ar";
    const arrEn = ["Industrial"];
    const arrAr = ["صناعي"];
    expect(localizedArray(arrEn, arrAr)).toEqual(["صناعي"]);
  });

  it("returns English when Arabic array is empty", () => {
    i18n.language = "ar";
    expect(localizedArray(["Industrial"], [])).toEqual(["Industrial"]);
  });

  it("returns English when Arabic array is undefined", () => {
    i18n.language = "ar";
    expect(localizedArray(["Industrial"], undefined)).toEqual(["Industrial"]);
  });

  it("returns empty array when both are undefined", () => {
    expect(localizedArray(undefined, undefined)).toEqual([]);
  });
});

describe("localizedSpecs", () => {
  beforeEach(() => {
    i18n.language = "en";
  });

  it("returns English specs when language is en", () => {
    const specs = { capacity: "5L", material: "HDPE" };
    expect(localizedSpecs(specs, { capacity: "5 لتر", material: "HDPE" })).toEqual(specs);
  });

  it("returns Arabic specs when language is ar", () => {
    i18n.language = "ar";
    const specs = { capacity: "5L" };
    const specsAr = { capacity: "5 لتر" };
    expect(localizedSpecs(specs, specsAr).capacity).toBe("5 لتر");
  });

  it("falls back to English when Arabic specs missing", () => {
    i18n.language = "ar";
    const specs = { capacity: "5L" };
    expect(localizedSpecs(specs, undefined).capacity).toBe("5L");
  });

  it("returns empty object when both are undefined", () => {
    expect(localizedSpecs(undefined, undefined)).toEqual({});
  });
});
