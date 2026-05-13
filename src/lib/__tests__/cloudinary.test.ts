import { describe, it, expect } from "vitest";
import { cldTransform } from "../cloudinary";

describe("cldTransform", () => {
  it("returns empty string when url is undefined", () => {
    expect(cldTransform(undefined, "w_400,q_auto")).toBe("");
  });

  it("returns empty string when url is null", () => {
    expect(cldTransform(null as unknown as undefined, "w_400,q_auto")).toBe("");
  });

  it("returns empty string when url is empty", () => {
    expect(cldTransform("", "w_400,q_auto")).toBe("");
  });

  it("returns original url for non-Cloudinary URLs", () => {
    const url = "https://example.com/image.jpg";
    expect(cldTransform(url, "w_400,q_auto")).toBe(url);
  });

  it("appends transforms to Cloudinary URL", () => {
    const url = "https://res.cloudinary.com/duarfvxjv/image/upload/v123/test.jpg";
    const expected = "https://res.cloudinary.com/duarfvxjv/image/upload/w_400,q_auto/v123/test.jpg";
    expect(cldTransform(url, "w_400,q_auto")).toBe(expected);
  });

  it("appends multiple transforms to Cloudinary URL", () => {
    const url = "https://res.cloudinary.com/duarfvxjv/image/upload/v123/test.jpg";
    const expected = "https://res.cloudinary.com/duarfvxjv/image/upload/w_200,h_200,c_fill,q_auto/v123/test.jpg";
    expect(cldTransform(url, "w_200,h_200,c_fill,q_auto")).toBe(expected);
  });
});
