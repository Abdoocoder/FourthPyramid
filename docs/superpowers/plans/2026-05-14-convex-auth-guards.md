# Convex Auth Guards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect all admin Convex mutations by verifying the caller is an authenticated Clerk user who exists in the `admins` table, and hard-fail in `AdminShell` when the Clerk key is missing.

**Architecture:** Convex's `ctx.auth.getUserIdentity()` returns the Clerk JWT subject (user ID) when the client sends a valid token. We create one `requireAdmin` helper that performs the identity check and `admins` table lookup, then call it at the top of every admin mutation handler. The frontend `AdminShell` is updated to use `ConvexProviderWithClerk` (already bundled in the `convex` package) so the Convex client automatically attaches Clerk tokens to every request.

**Tech Stack:** Convex (backend), Clerk (`@clerk/clerk-react`, `convex/react-clerk`), React + TypeScript (frontend), Vitest (tests)

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Create | `convex/auth.config.ts` | Tells Convex which JWT issuer to trust (Clerk) |
| Create | `convex/lib/requireAdmin.ts` | Reusable auth guard — throws if caller is not an admin |
| Modify | `convex/products.ts` | Add `requireAdmin` to `create`, `update`, `remove` |
| Modify | `convex/categories.ts` | Add `requireAdmin` to `create`, `remove` |
| Modify | `convex/quotes.ts` | Add `requireAdmin` to `updateStatus` |
| Modify | `convex/pages.ts` | Add `requireAdmin` to `upsert`, `remove` |
| Modify | `convex/gallery.ts` | Add `requireAdmin` to `add`, `remove` |
| Modify | `convex/admins.ts` | Add `requireAdmin` to `create`; add identity check to `list` |
| Modify | `src/admin/components/AdminShell.tsx` | Use `ConvexProviderWithClerk`; hard-error on missing Clerk key |

**Public mutations left unchanged** (intentionally unauthenticated):
- `contacts.create` — public contact form
- `quotes.create` — public quote request

---

## Task 1: Configure Convex to trust Clerk JWTs

**Files:**
- Create: `convex/auth.config.ts`

Convex needs to know which JWT issuer to trust before `ctx.auth.getUserIdentity()` can return anything other than `null`. This is done via `convex/auth.config.ts` which is read by the Convex runtime (not Vite — no `import.meta.env` here, use `process.env`).

The `CLERK_JWT_ISSUER_DOMAIN` value comes from the Clerk dashboard: **Clerk Dashboard → your app → API Keys → Advanced → JWT Issuer**. It looks like `https://your-app.clerk.accounts.dev`. Set it as a Convex environment variable in the Convex dashboard under **Settings → Environment Variables**.

- [ ] **Step 1: Create `convex/auth.config.ts`**

```ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
};
```

- [ ] **Step 2: Set the env var in Convex dashboard**

Go to [Convex Dashboard](https://dashboard.convex.dev) → your project → **Settings → Environment Variables** and add:

```
CLERK_JWT_ISSUER_DOMAIN = https://<your-clerk-subdomain>.clerk.accounts.dev
```

Find this value in **Clerk Dashboard → Configure → API Keys → Advanced → JWT Issuer**.

- [ ] **Step 3: Restart Convex dev server**

```bash
npx convex dev
```

Expected: Convex reloads without errors. You can verify in the Convex dashboard logs that the auth config was applied.

- [ ] **Step 4: Commit**

```bash
git add convex/auth.config.ts
git commit -m "feat: configure Convex to trust Clerk JWTs"
```

---

## Task 2: Create `requireAdmin` auth helper

**Files:**
- Create: `convex/lib/requireAdmin.ts`

This helper is called at the top of every admin mutation. It:
1. Gets the Clerk identity from the Convex auth context
2. Throws `"Unauthenticated"` if no identity (not signed in)
3. Looks up the caller in the `admins` table by `clerkId`
4. Throws `"Unauthorized"` if not in the admins table
5. Returns the admin record so callers can check role if needed

There is no test framework for Convex server functions in this repo, so we verify via the Convex dashboard's function runner in Task 3.

- [ ] **Step 1: Create `convex/lib/requireAdmin.ts`**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add convex/lib/requireAdmin.ts
git commit -m "feat: add requireAdmin helper for Convex mutations"
```

---

## Task 3: Guard `products` mutations

**Files:**
- Modify: `convex/products.ts`

Add `await requireAdmin(ctx)` as the first line of `create`, `update`, and `remove`. Leave `list`, `getBySlug`, and `getById` (queries) untouched — product data is public.

- [ ] **Step 1: Update `convex/products.ts`**

Replace the entire file with:

```ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

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
    await requireAdmin(ctx);
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
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add convex/products.ts
git commit -m "feat: require admin auth for product mutations"
```

---

## Task 4: Guard `categories` mutations

**Files:**
- Modify: `convex/categories.ts`

- [ ] **Step 1: Update `convex/categories.ts`**

```ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    name_ar: v.optional(v.string()),
    slug: v.string(),
    description: v.string(),
    description_ar: v.optional(v.string()),
    icon: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("categories", args);
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add convex/categories.ts
git commit -m "feat: require admin auth for category mutations"
```

---

## Task 5: Guard `quotes.updateStatus`

**Files:**
- Modify: `convex/quotes.ts`

`quotes.create` stays public — it is the public "request a quote" form. Only `updateStatus` needs a guard.

- [ ] **Step 1: Update `convex/quotes.ts`**

```ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

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
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add convex/quotes.ts
git commit -m "feat: require admin auth for quote status updates"
```

---

## Task 6: Guard `pages` mutations

**Files:**
- Modify: `convex/pages.ts`

- [ ] **Step 1: Update `convex/pages.ts`**

```ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

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
    await requireAdmin(ctx);
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
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add convex/pages.ts
git commit -m "feat: require admin auth for page mutations"
```

---

## Task 7: Guard `gallery` mutations

**Files:**
- Modify: `convex/gallery.ts`

- [ ] **Step 1: Update `convex/gallery.ts`**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add convex/gallery.ts
git commit -m "feat: require admin auth for gallery mutations"
```

---

## Task 8: Guard `admins` mutations

**Files:**
- Modify: `convex/admins.ts`

`admins.create` needs a guard so only existing admins can create new admins. `admins.list` also needs a guard — listing all admin accounts should not be public.

- [ ] **Step 1: Update `convex/admins.ts`**

```ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const create = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("superadmin")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("admins", args);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    return await ctx.db.query("admins").collect();
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add convex/admins.ts
git commit -m "feat: require admin auth for admins mutations and list query"
```

---

## Task 9: Wire `ConvexProviderWithClerk` in AdminShell and hard-error on missing key

**Files:**
- Modify: `src/admin/components/AdminShell.tsx`

`convex/react-clerk` is already bundled inside the `convex` package (confirmed in `node_modules/convex/react-clerk`). No new `npm install` needed.

`ConvexProviderWithClerk` replaces the outer `ConvexProvider` for the admin subtree. It automatically attaches the current Clerk session token to every Convex request, so `ctx.auth.getUserIdentity()` returns the identity server-side.

- [ ] **Step 1: Update `src/admin/components/AdminShell.tsx`**

```tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "./AdminLayout";

const DashboardPage = lazy(() => import("../pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const AdminProductsPage = lazy(() => import("../pages/AdminProductsPage").then((m) => ({ default: m.AdminProductsPage })));
const AdminProductFormPage = lazy(() => import("../pages/AdminProductFormPage").then((m) => ({ default: m.AdminProductFormPage })));
const AdminPagesPage = lazy(() => import("../pages/AdminPagesPage").then((m) => ({ default: m.AdminPagesPage })));
const AdminQuotesPage = lazy(() => import("../pages/AdminQuotesPage").then((m) => ({ default: m.AdminQuotesPage })));
const AdminImagesPage = lazy(() => import("../pages/AdminImagesPage").then((m) => ({ default: m.AdminImagesPage })));

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!clerkKey) throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set. Admin panel cannot load.");
if (!convexUrl) throw new Error("VITE_CONVEX_URL is not set. Admin panel cannot load.");

const adminConvexClient = new ConvexReactClient(convexUrl);

function AdminRoutes() {
  return (
    <Suspense fallback={<div className="animate-pulse text-on-surface-variant p-8">Loading...</div>}>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/edit/:id" element={<AdminProductFormPage />} />
        <Route path="pages" element={<AdminPagesPage />} />
        <Route path="quotes" element={<AdminQuotesPage />} />
        <Route path="images" element={<AdminImagesPage />} />
      </Routes>
    </Suspense>
  );
}

function AuthenticatedAdmin() {
  return (
    <ConvexProviderWithClerk client={adminConvexClient} useAuth={useAuth}>
      <ProtectedRoute>
        <AdminLayout>
          <AdminRoutes />
        </AdminLayout>
      </ProtectedRoute>
    </ConvexProviderWithClerk>
  );
}

export default function AdminShell() {
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <AuthenticatedAdmin />
    </ClerkProvider>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Run the app and test the admin panel manually**

```bash
npm run dev
```

Open `http://localhost:5173/admin`. Expected: Sign-in screen from Clerk. After signing in with a Clerk account that exists in the `admins` table, admin panel loads. Attempting to call a mutation from browser devtools without auth should result in an `"Unauthenticated"` error in the Convex logs.

- [ ] **Step 4: Commit**

```bash
git add src/admin/components/AdminShell.tsx
git commit -m "feat: use ConvexProviderWithClerk in AdminShell, hard-error on missing env vars"
```

---

## Verification Checklist

After all tasks are complete:

- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run test` passes
- [ ] Admin sign-in flow works end-to-end in the browser
- [ ] An unauthenticated Convex mutation call (e.g. from browser console: `window.__convex?.mutation(...)`) returns `"Unauthenticated"`
- [ ] A Clerk-authenticated user NOT in the `admins` table receives `"Unauthorized"` 
- [ ] A Clerk-authenticated user IN the `admins` table can create/update/delete products normally
- [ ] Public pages (home, products, contact) still load without auth
- [ ] Quote request form still works without auth
- [ ] Contact form still works without auth
