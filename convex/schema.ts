import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
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
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_featured", ["featured"]),

  categories: defineTable({
    name: v.string(),
    name_ar: v.optional(v.string()),
    slug: v.string(),
    description: v.string(),
    description_ar: v.optional(v.string()),
    icon: v.string(),
    image: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  quotes: defineTable({
    companyName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.string(),
    productType: v.string(),
    quantity: v.string(),
    message: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("contacted"),
      v.literal("closed")
    ),
  }).index("by_status", ["status"]),

  admins: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("superadmin")),
  }).index("by_clerk_id", ["clerkId"]),
});
