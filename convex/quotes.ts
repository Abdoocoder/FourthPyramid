import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { status: v.optional(v.union(v.literal("pending"), v.literal("contacted"), v.literal("closed"))) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("quotes")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("quotes").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    companyName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.string(),
    productType: v.string(),
    quantity: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quotes", {
      ...args,
      status: "pending",
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("quotes"),
    status: v.union(v.literal("pending"), v.literal("contacted"), v.literal("closed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
