/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admins from "../admins.js";
import type * as categories from "../categories.js";
import type * as contacts from "../contacts.js";
import type * as gallery from "../gallery.js";
import type * as images from "../images.js";
import type * as lib_requireAdmin from "../lib/requireAdmin.js";
import type * as migrate_ar from "../migrate_ar.js";
import type * as pages from "../pages.js";
import type * as products from "../products.js";
import type * as quotes from "../quotes.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admins: typeof admins;
  categories: typeof categories;
  contacts: typeof contacts;
  gallery: typeof gallery;
  images: typeof images;
  "lib/requireAdmin": typeof lib_requireAdmin;
  migrate_ar: typeof migrate_ar;
  pages: typeof pages;
  products: typeof products;
  quotes: typeof quotes;
  seed: typeof seed;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
