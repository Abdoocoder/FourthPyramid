import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("gallery").order("desc").collect();
  },
});

export const add = mutation({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.insert("gallery", { url: args.url, createdAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("gallery") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
