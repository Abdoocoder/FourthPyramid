import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("categories").collect();
    if (existing.length > 0) return;

    const catIds: Record<string, Id<"categories">> = {};

    const categories = [
      { name: "Commercial Bottles", name_ar: "زجاجات تجارية", slug: "commercial-bottles", description: "PET and HDPE bottles for beverages, cosmetics, and household products.", description_ar: "زجاجات PET و HDPE للمشروبات ومستحضرات التجميل والمنتجات المنزلية.", icon: "bottle" },
      { name: "Industrial Containers", name_ar: "حاويات صناعية", slug: "industrial-containers", description: "Heavy-duty storage solutions designed for stacking and logistics.", description_ar: "حلول تخزين متينة مصممة للتكديس والخدمات اللوجستية.", icon: "container" },
      { name: "Chemical Containers", name_ar: "حاويات كيميائية", slug: "chemical-containers", description: "UN-approved, chemically resistant packaging for hazardous materials.", description_ar: "تعبئة معتمدة من الأمم المتحدة ومقاومة كيميائياً للمواد الخطرة.", icon: "chemical" },
      { name: "Jerrycans", name_ar: "جراكن", slug: "jerrycans", description: "Durable, high-capacity liquid transport containers with secure closures.", description_ar: "حاويات نقل سوائل متينة وعالية السعة بأغطية آمنة.", icon: "jerrycan" },
    ];

    for (const cat of categories) {
      catIds[cat.slug] = await ctx.db.insert("categories", cat);
    }

    const products = [
      {
        name: "5L Chemical Jerrycan",
        name_ar: "جركن كيميائي 5 لتر",
        slug: "5l-chemical-jerrycan",
        description: "Engineered for high-performance chemical storage and transport. Manufactured from premium HDPE offering superior impact resistance and chemical compatibility.",
        description_ar: "مصمم هندسياً للتخزين والنقل الكيميائي عالي الأداء. مصنوع من البولي إيثيلين عالي الكثافة المتميز الذي يوفر مقاومة فائقة للصدمات والتوافق الكيميائي.",
        images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80&auto=format"],
        categoryId: catIds["chemical-containers"]!,
        specs: {
          capacity: "5000 ml (5 Liter)",
          material: "High-Density Polyethylene (HDPE)",
          dimensions: "190 x 140 x 285 mm",
          weight: "250g ± 10g",
          closureType: "DIN 45 Tamper-Evident Screw Cap",
          unCertification: "3H1/Y1.9/150",
          colorsAvailable: "White, Blue, Custom",
          palletQuantity: "120 Units / Pallet",
        },
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
        useCases: ["Agrochemicals", "Industrial Detergents", "Lubricants"],
        useCases_ar: ["كيماويات زراعية", "منظفات صناعية", "مواد تشحيم"],
        certifications: ["Industrial Grade", "UN Certified"],
        certifications_ar: ["درجة صناعية", "معتمد من الأمم المتحدة"],
        featured: true,
      },
      {
        name: "1L Beverage Bottle",
        name_ar: "زجاجة مشروبات 1 لتر",
        slug: "1l-beverage-bottle",
        description: "Lightweight PET bottle optimized for beverage packaging. Crystal clear material with consistent wall thickness.",
        description_ar: "زجاجة PET خفيفة الوزن محسّنة لتعبئة المشروبات. مادة شفافة تماماً بسماكة جدار متناسقة.",
        images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80&auto=format"],
        categoryId: catIds["commercial-bottles"]!,
        specs: {
          capacity: "1000 ml (1 Liter)",
          material: "PET",
          dimensions: "85 x 85 x 240 mm",
          weight: "35g ± 2g",
          closureType: "28mm PCO 1881 Screw Cap",
          unCertification: "N/A",
          colorsAvailable: "Clear, Custom",
          palletQuantity: "500 Units / Pallet",
        },
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
        useCases: ["Beverages", "Water", "Juices"],
        useCases_ar: ["مشروبات", "مياه", "عصائر"],
        certifications: ["Food Grade"],
        certifications_ar: ["درجة غذائية"],
        featured: true,
      },
      {
        name: "20L Storage Container",
        name_ar: "حاوية تخزين 20 لتر",
        slug: "20l-storage-container",
        description: "Heavy-duty HDPE storage container with reinforced ribbed walls for stacking strength.",
        description_ar: "حاوية تخزين HDPE متينة بجدران مضلعة معززة لقوة التكديس.",
        images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80&auto=format"],
        categoryId: catIds["industrial-containers"]!,
        specs: {
          capacity: "20000 ml (20 Liter)",
          material: "High-Density Polyethylene (HDPE)",
          dimensions: "290 x 240 x 380 mm",
          weight: "850g ± 20g",
          closureType: "70mm Wide Mouth Cap",
          unCertification: "N/A",
          colorsAvailable: "Blue, White, Custom",
          palletQuantity: "48 Units / Pallet",
        },
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
        useCases: ["Bulk Storage", "Water Storage", "Industrial Fluids"],
        useCases_ar: ["تخزين بالجملة", "تخزين مياه", "سوائل صناعية"],
        certifications: ["Heavy Duty"],
        certifications_ar: ["خدمة شاقة"],
        featured: true,
      },
      {
        name: "500ml Boston Round Bottle",
        name_ar: "زجاجة بوسطن راوند 500 مل",
        slug: "500ml-boston-round-bottle",
        description: "Classic Boston round design in durable HDPE. Ideal for laboratory chemicals, cosmetics, and specialty liquids.",
        description_ar: "تصميم بوسطن راوند الكلاسيكي من HDPE المتين. مثالي للكيماويات المختبرية ومستحضرات التجميل والسوائل المتخصصة.",
        images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80&auto=format"],
        categoryId: catIds["commercial-bottles"]!,
        specs: {
          capacity: "500 ml",
          material: "HDPE",
          dimensions: "65 x 65 x 180 mm",
          weight: "25g ± 2g",
          closureType: "24mm Cap",
          unCertification: "N/A",
          colorsAvailable: "White, Natural, Custom",
          palletQuantity: "800 Units / Pallet",
        },
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
        useCases: ["Laboratory Chemicals", "Cosmetics", "Essential Oils"],
        useCases_ar: ["كيماويات مختبرية", "مستحضرات تجميل", "زيوت عطرية"],
        certifications: ["Food Grade"],
        certifications_ar: ["درجة غذائية"],
        featured: false,
      },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }
  },
});
