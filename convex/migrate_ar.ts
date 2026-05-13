import { mutation } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

type ArabicProductData = Pick<Doc<"products">, "name_ar" | "description_ar" | "specs_ar" | "useCases_ar" | "certifications_ar">;

export const migrateArabicFields = mutation({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    const arCats: Record<string, { name_ar: string; description_ar: string }> = {
      "commercial-bottles": { name_ar: "زجاجات تجارية", description_ar: "زجاجات PET و HDPE للمشروبات ومستحضرات التجميل والمنتجات المنزلية." },
      "industrial-containers": { name_ar: "حاويات صناعية", description_ar: "حلول تخزين متينة مصممة للتكديس والخدمات اللوجستية." },
      "chemical-containers": { name_ar: "حاويات كيميائية", description_ar: "تعبئة معتمدة من الأمم المتحدة ومقاومة كيميائياً للمواد الخطرة." },
      jerrycans: { name_ar: "جراكن", description_ar: "حاويات نقل سوائل متينة وعالية السعة بأغطية آمنة." },
    };

    for (const cat of categories) {
      const ar = arCats[cat.slug];
      if (ar) {
        await ctx.db.patch(cat._id, ar);
      }
    }

    const products = await ctx.db.query("products").collect();
    const arProducts: Record<string, ArabicProductData> = {
      "5l-chemical-jerrycan": {
        name_ar: "جركن كيميائي 5 لتر",
        description_ar: "مصمم هندسياً للتخزين والنقل الكيميائي عالي الأداء. مصنوع من البولي إيثيلين عالي الكثافة المتميز الذي يوفر مقاومة فائقة للصدمات والتوافق الكيميائي.",
        specs_ar: {
          capacity: "5000 مل (5 لتر)",
          material: "بولي إيثيلين عالي الكثافة (HDPE)",
          dimensions: "285 × 140 × 190 مم",
          weight: "250 جم ± 10 جم",
          closureType: "غطاء لولبي DIN 45 مانع للتلاعب",
          unCertification: "3H1/Y1.9/150",
          colorsAvailable: "أبيض، أزرق، حسب الطلب",
          palletQuantity: "120 وحدة / منصة ناقلة",
        },
        useCases_ar: ["كيماويات زراعية", "منظفات صناعية", "مواد تشحيم"],
        certifications_ar: ["درجة صناعية", "معتمد من الأمم المتحدة"],
      },
      "1l-beverage-bottle": {
        name_ar: "زجاجة مشروبات 1 لتر",
        description_ar: "زجاجة PET خفيفة الوزن محسّنة لتعبئة المشروبات. مادة شفافة تماماً بسماكة جدار متناسقة.",
        specs_ar: {
          capacity: "1000 مل (1 لتر)",
          material: "PET",
          dimensions: "240 × 85 × 85 مم",
          weight: "35 جم ± 2 جم",
          closureType: "غطاء لولبي 28 مم PCO 1881",
          unCertification: "غير متاح",
          colorsAvailable: "شفاف، حسب الطلب",
          palletQuantity: "500 وحدة / منصة ناقلة",
        },
        useCases_ar: ["مشروبات", "مياه", "عصائر"],
        certifications_ar: ["درجة غذائية"],
      },
      "20l-storage-container": {
        name_ar: "حاوية تخزين 20 لتر",
        description_ar: "حاوية تخزين HDPE متينة بجدران مضلعة معززة لقوة التكديس.",
        specs_ar: {
          capacity: "20000 مل (20 لتر)",
          material: "بولي إيثيلين عالي الكثافة (HDPE)",
          dimensions: "380 × 240 × 290 مم",
          weight: "850 جم ± 20 جم",
          closureType: "غطاء واسع الفم 70 مم",
          unCertification: "غير متاح",
          colorsAvailable: "أزرق، أبيض، حسب الطلب",
          palletQuantity: "48 وحدة / منصة ناقلة",
        },
        useCases_ar: ["تخزين بالجملة", "تخزين مياه", "سوائل صناعية"],
        certifications_ar: ["خدمة شاقة"],
      },
      "500ml-boston-round-bottle": {
        name_ar: "زجاجة بوسطن راوند 500 مل",
        description_ar: "تصميم بوسطن راوند الكلاسيكي من HDPE المتين. مثالي للكيماويات المختبرية ومستحضرات التجميل والسوائل المتخصصة.",
        specs_ar: {
          capacity: "500 مل",
          material: "HDPE",
          dimensions: "180 × 65 × 65 مم",
          weight: "25 جم ± 2 جم",
          closureType: "غطاء 24 مم",
          unCertification: "غير متاح",
          colorsAvailable: "أبيض، طبيعي، حسب الطلب",
          palletQuantity: "800 وحدة / منصة ناقلة",
        },
        useCases_ar: ["كيماويات مختبرية", "مستحضرات تجميل", "زيوت عطرية"],
        certifications_ar: ["درجة غذائية"],
      },
    };

    for (const product of products) {
      const ar = arProducts[product.slug];
      if (ar) {
        await ctx.db.patch(product._id, ar);
      }
    }
  },
});
