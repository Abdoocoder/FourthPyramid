import type { MutationCtx, QueryCtx } from "../_generated/server";

export async function requireAdmin(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const admin = await ctx.db
    .query("admins")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
  if (!admin) throw new Error("Unauthorized");

  return admin;
}
