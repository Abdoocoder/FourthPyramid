import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

export const list = query({
  args: { status: v.optional(v.union(v.literal("pending"), v.literal("contacted"), v.literal("closed"))) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
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
    honeypot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.honeypot) return;
    return await ctx.db.insert("quotes", {
      companyName: args.companyName,
      contactName: args.contactName,
      email: args.email,
      phone: args.phone,
      productType: args.productType,
      quantity: args.quantity,
      message: args.message,
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
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});
