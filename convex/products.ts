import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    categorySlug: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let products;

    if (args.featured !== undefined) {
      products = await ctx.db
        .query("products")
        .withIndex("by_featured", (q) => q.eq("featured", args.featured!))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }

    if (args.categorySlug) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug!))
        .first();
      if (category) {
        products = products.filter((p) => p.categoryId === category._id);
      }
    }

    if (args.searchQuery) {
      const q = args.searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.name_ar && p.name_ar.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.description_ar && p.description_ar.toLowerCase().includes(q))
      );
    }

    const categories = await ctx.db.query("categories").collect();
    const catMap = Object.fromEntries(categories.map((c) => [c._id, c]));

    return products.map((p) => ({
      ...p,
      category: catMap[p.categoryId]?.name ?? "",
      category_ar: catMap[p.categoryId]?.name_ar ?? "",
      categorySlug: catMap[p.categoryId]?.slug ?? "",
    }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!product) return null;

    const category = await ctx.db.get(product.categoryId);
    return {
      ...product,
      category: category?.name ?? "",
      category_ar: category?.name_ar ?? "",
      categorySlug: category?.slug ?? "",
    };
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    name_ar: v.optional(v.string()),
    slug: v.string(),
    description: v.string(),
    description_ar: v.optional(v.string()),
    images: v.array(v.string()),
    categoryId: v.id("categories"),
    specs: v.object({
      capacity: v.string(),
      material: v.string(),
      dimensions: v.string(),
      weight: v.string(),
      closureType: v.string(),
      unCertification: v.string(),
      colorsAvailable: v.string(),
      palletQuantity: v.string(),
    }),
    specs_ar: v.optional(v.object({
      capacity: v.string(),
      material: v.string(),
      dimensions: v.string(),
      weight: v.string(),
      closureType: v.string(),
      unCertification: v.string(),
      colorsAvailable: v.string(),
      palletQuantity: v.string(),
    })),
    useCases: v.array(v.string()),
    useCases_ar: v.optional(v.array(v.string())),
    certifications: v.array(v.string()),
    certifications_ar: v.optional(v.array(v.string())),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    name_ar: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    description_ar: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    categoryId: v.optional(v.id("categories")),
    specs: v.optional(
      v.object({
        capacity: v.string(),
        material: v.string(),
        dimensions: v.string(),
        weight: v.string(),
        closureType: v.string(),
        unCertification: v.string(),
        colorsAvailable: v.string(),
        palletQuantity: v.string(),
      })
    ),
    specs_ar: v.optional(
      v.object({
        capacity: v.string(),
        material: v.string(),
        dimensions: v.string(),
        weight: v.string(),
        closureType: v.string(),
        unCertification: v.string(),
        colorsAvailable: v.string(),
        palletQuantity: v.string(),
      })
    ),
    useCases: v.optional(v.array(v.string())),
    useCases_ar: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    certifications_ar: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
