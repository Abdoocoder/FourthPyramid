import { describe, it, expect } from "vitest";
import { requireAdmin } from "../requireAdmin";

function makeCtx({
  identity = null as { subject: string } | null,
  admin = null as object | null,
} = {}) {
  return {
    auth: {
      getUserIdentity: async () => identity,
    },
    db: {
      query: () => ({
        withIndex: (_name: string, _fn: (q: unknown) => unknown) => ({
          first: async () => admin,
        }),
      }),
    },
  } as Parameters<typeof requireAdmin>[0];
}

describe("requireAdmin", () => {
  it("throws Unauthenticated when there is no identity", async () => {
    await expect(requireAdmin(makeCtx({ identity: null }))).rejects.toThrow(
      "Unauthenticated"
    );
  });

  it("throws Unauthorized when the caller has no admins record", async () => {
    await expect(
      requireAdmin(makeCtx({ identity: { subject: "user_abc" }, admin: null }))
    ).rejects.toThrow("Unauthorized");
  });

  it("returns the admin record when the caller is a known admin", async () => {
    const admin = {
      clerkId: "user_abc",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin" as const,
    };
    const result = await requireAdmin(
      makeCtx({ identity: { subject: "user_abc" }, admin })
    );
    expect(result).toEqual(admin);
  });
});
