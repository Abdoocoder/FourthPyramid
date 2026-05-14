# Fourth Pyramid Plastic Industries

Corporate website for Fourth Pyramid Plastic Industries — a Jordan-based manufacturer of plastic packaging, industrial containers, chemical jerrycans, and commercial bottles.

Built with React 19, Vite 8, Tailwind CSS 4, Convex backend, Clerk auth, Cloudinary for images, GSAP animations, and a full admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Vite 8 |
| Styling | Tailwind CSS 4, MD3 color system, custom easing curves |
| Backend | Convex (realtime, edge-deployed, TypeScript) |
| Auth | Clerk (admin dashboard only) |
| i18n | react-i18next (English / Arabic, RTL layout) |
| Animations | GSAP 3 (ScrollTrigger, entrance, stagger) |
| Icons | Lucide React |
| Images | Cloudinary (unsigned upload, CDN, WebP, responsive transforms) |
| Testing | Vitest + React Testing Library + jest-dom |
| Linting | ESLint with TypeScript + React Hooks plugins |
| Hosting | Vercel (frontend) + Convex Cloud (backend) |

## Features

### Public Site
- **Bilingual support** — Full English + Arabic with RTL layout via react-i18next
- **Product catalog** — Browse, search, and filter by category; bilingual content (name, description, specs, use cases, certifications)
- **Product detail pages** — Image gallery with thumbnail navigation, spec tables, use cases, certifications
- **Industries page** — 4 industry verticals covered by the company
- **Contact page** — Contact info (phone, WhatsApp, email, address) + Google Maps embed + contact form with honeypot spam protection
- **Quote requests** — In-app quote form with Convex persistence and honeypot spam protection
- **MD3 color system** — Material Design 3 palette with dark mode support
- **Responsive** — Mobile-first design (360px+) with touch-aware interactions
- **Accessible** — Skip link, keyboard navigation, WCAG AA contrast, reduced-motion support, semantic landmarks, ARIA labels
- **Performance** — CSS-only stagger animations, custom easing curves (expo-out, strong-out), compositor-only transform/opacity transitions, GPU-layer promotion, lazy-loaded pages

### Admin Dashboard
- **Clerk-protected** — All admin routes behind Clerk authentication
- **Dashboard** — Stats overview (products count, pending/total quotes), pending quotes list, quick actions
- **Product management** — Full CRUD with bilingual fields (name, description, specs, use cases, certifications), category assignment, featured flag, Cloudinary image upload
- **Category management** — Create and remove product categories
- **Page editor** — Block-based content editor (heading, text, image, list blocks) with bilingual support for both EN and AR versions
- **Quote management** — Quote request table with status filtering (pending/contacted/closed), CSV export
- **Image gallery** — Grid view with Cloudinary upload, copy URL, delete

### Backend (Convex)
- **7 database tables**: products, categories, quotes, pages, gallery, contacts, admins
- **Auth guards** — All admin mutations protected by `requireAdmin()` helper that verifies Clerk JWT identity against the admins table
- **Bilingual schema** — Parallel fields for English/Arabic content (`name` + `name_ar`, etc.)
- **Honeypot spam protection** — Hidden fields on public forms (contact + quote)
- **Seed data** — 4 categories and 4 products with full bilingual content

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npx convex dev
npm run dev
```

The Convex dev server runs locally and watches your `convex/` functions. Vite dev server runs concurrently.

## Environment Variables

Create `.env.local`:

```
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Project Structure

```
├── convex/                      # Convex backend (database + functions)
│   ├── auth.config.ts           # Clerk JWT issuer config
│   ├── lib/
│   │   └── requireAdmin.ts      # Auth guard helper
│   ├── schema.ts                # DB schema (7 tables)
│   ├── products.ts              # Product queries + mutations (bilingual)
│   ├── categories.ts            # Category queries + mutations
│   ├── quotes.ts                # Quote queries + mutations
│   ├── pages.ts                 # Pages queries + mutations (block-based)
│   ├── contacts.ts              # Public contact form mutation
│   ├── gallery.ts               # Image gallery CRUD
│   ├── images.ts                # Convex storage upload URL
│   ├── admins.ts                # Admin queries + mutations
│   ├── seed.ts                  # Seed data
│   └── migrate_ar.ts            # Arabic field migration
├── src/
│   ├── admin/                   # Admin dashboard pages + components
│   │   ├── components/
│   │   │   ├── AdminLayout.tsx   # Sidebar nav layout
│   │   │   ├── AdminShell.tsx    # Clerk + ConvexProvider wrapper
│   │   │   └── ProtectedRoute.tsx # Auth gate (Clerk SignIn)
│   │   └── pages/
│   │       ├── DashboardPage.tsx
│   │       ├── AdminProductsPage.tsx
│   │       ├── AdminProductFormPage.tsx
│   │       ├── AdminPagesPage.tsx
│   │       ├── AdminQuotesPage.tsx
│   │       └── AdminImagesPage.tsx
│   ├── components/
│   │   ├── layout/              # Header, Footer, Layout
│   │   └── ui/                  # Button, Card, Badge, Input, SpecTable, CloudinaryUpload
│   ├── i18n/
│   │   ├── config.ts            # i18next setup with LanguageDetector
│   │   └── locales/             # en.json (260+ keys), ar.json
│   ├── lib/
│   │   ├── animations.ts        # GSAP scroll reveal + page entrance hooks
│   │   ├── cloudinary.ts        # Cloudinary URL transform helper
│   │   ├── constants.ts         # Site config, nav links, industries data
│   │   ├── convex.ts            # Convex client factory (null-safe)
│   │   ├── localized.ts         # Bilingual field helpers
│   │   └── usePageTitle.ts      # Dynamic document.title hook
│   ├── pages/                   # HomePage, AboutPage, ProductsPage,
│   │                            # ProductDetailsPage, IndustriesPage,
│   │                            # ContactPage, RequestQuotePage
│   ├── test/setup.ts            # Vitest setup (jest-dom matchers)
│   ├── types/cloudinary.d.ts    # Cloudinary widget types
│   ├── App.tsx                  # Router + DirectionSetter (RTL)
│   ├── index.css                # Tailwind v4 + MD3 tokens + RTL + animations
│   └── main.tsx                 # Entry point
├── design-system/
│   └── fourth-pyramid/
│       └── MASTER.md            # Full design system documentation
├── docs/
│   └── superpowers/plans/       # Implementation plans
├── public/                      # Static assets (logos, icons)
├── .agents/skills/              # 12 Claude Code design skills
├── .claude/skills/              # Skill mirror
│   settings.local.json          # Claude permissions
└── .opencode/skills/
    └── ui-ux-pro-max/           # UI/UX design search engine skill
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npx convex dev` | Start Convex local dev server |
| `npx convex deploy` | Deploy Convex functions to production |
| `npx convex run` | Run a Convex function (query/mutation) |

## Testing

39 unit tests across 5 test files using Vitest + React Testing Library:

| File | Tests | What it covers |
|------|-------|----------------|
| `Button.test.tsx` | 10 | All variants, sizes, as prop, click handlers |
| `Badge.test.tsx` | 5 | All variants, custom className |
| `cloudinary.test.ts` | 6 | URL transformation, edge cases |
| `localized.test.ts` | 13 | Bilingual field helpers (EN/AR, arrays, specs) |
| `requireAdmin.test.ts` | 3 | Auth guard (unauthenticated, unauthorized, authorized) |

```bash
npm run test
```

## Deployment

Frontend is deployed to Vercel. Backend runs on Convex Cloud.

```bash
# Deploy Convex functions
npx convex deploy

# Deploy frontend (requires Vercel CLI)
npx vercel deploy --prod
```

Convex production URL and Clerk publishable key are set as Vercel environment variables. All routes rewrite to `index.html` (SPA fallback). Static assets cached with `immutable` headers (1 year).

## Architecture

```
Public Site (no auth)              Admin Dashboard (Clerk auth)
       │                                  │
       └────────── Convex ────────────────┘
                  │        │
           Cloudinary    Database
           (images)      (7 tables)
                  │
               CDN (WebP,
            responsive transforms)
```

- **Dual Convex client**: Public site uses `ConvexProvider` (no auth), admin uses `ConvexProviderWithClerk` (with Clerk JWT tokens)
- **Conditional rendering**: If `VITE_CONVEX_URL` is not set, the app renders without Convex (offline/static mode)
- **Auth guards**: All admin mutations are protected by `requireAdmin()` which verifies the caller is an authenticated Clerk user in the `admins` table
- **Bilingual content**: Stored as parallel fields (`name` + `name_ar`, etc.) with localization helpers in `src/lib/localized.ts`
- **Spam protection**: Honeypot hidden fields on public forms (contact + quote) with server-side validation
- **Lazy loading**: All page components loaded via `React.lazy()` with `Suspense` and `PageLoader` spinner

## Design System

See `design-system/fourth-pyramid/MASTER.md` for the complete design system documentation.

- **Primary / Pyramid Blue**: `#4A90E2` — buttons, headings, hero
- **Secondary / Sky Blue**: `#87B2E8` — links, secondary buttons
- **Tertiary / CTA**: `#C84000` (orange) — call-to-action accents
- **Background**: `#F4F7F9`, Surface: `#FFFFFF`
- **Text**: `#2C3E50` — body and headings
- **Muted**: `#4B5563` — secondary text
- **Outline**: `#7A7A7A` — borders, dividers (3:1 non-text threshold)
- **Fonts**: Outfit (headlines/buttons), IBM Plex Sans (body), IBM Plex Mono (data). Arabic RTL auto-swap to Cairo.
- **Easing**: Custom cubic-bezier curves: `ease-out-expo` (0.19, 1, 0.22, 1), `ease-out-strong` (0.23, 1, 0.32, 1), `ease-in-out-strong` (0.77, 0, 0.175, 1)
- **Button press**: `scale(0.97)` at 120ms with `ease-out-strong`
- **Stagger entries**: translateY(8px) + opacity, 400ms, 60ms delay between items
- **Dark mode**: Inverted MD3 palette via `prefers-color-scheme: dark`

## Skills & Agent Configuration

This project includes 12 Claude Code design skills (`.agents/skills/`) covering brand identity, UI/UX design patterns, animation engineering, accessibility, and more. Skills are locked to specific versions via `skills-lock.json`.

The project also includes 3 OpenCode skills (`.opencode/skills/`): code-review (automated PR review), frontend-design (production-grade UI generation), and ui-ux-pro-max (searchable database of 67 design styles, 96 color palettes, 57 font pairings, 99 UX guidelines, and 13 technology stacks).

## Product Vision

See `PRODUCT.md` for the full product vision document covering target users, design principles, brand personality, and success criteria.

## License

All rights reserved. Fourth Pyramid Plastic Industries.
