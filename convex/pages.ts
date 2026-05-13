import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const contentBlockSchema = v.object({
  type: v.string(),
  content: v.string(),
  level: v.optional(v.number()),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pages").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("pages")),
    slug: v.string(),
    title: v.string(),
    title_ar: v.optional(v.string()),
    blocks: v.array(contentBlockSchema),
    blocks_ar: v.optional(v.array(contentBlockSchema)),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const payload = { ...data, updatedAt: Date.now() };
    if (id) {
      await ctx.db.patch(id, payload);
      return id;
    }
    return await ctx.db.insert("pages", payload);
  },
});

export const remove = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
