# Fourth Pyramid Plastic Industries

Corporate website for Fourth Pyramid Plastic Industries — a Jordan-based manufacturer of plastic packaging, industrial containers, chemical jerrycans, and commercial bottles.

Built with React 19, Vite 8, Tailwind CSS 4, Convex backend, Cloudinary for images.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Vite 8 |
| Styling | Tailwind CSS 4, MD3 color system |
| Backend | Convex (realtime, edge-deployed) |
| Auth | Clerk (admin dashboard) |
| i18n | react-i18next (English / Arabic) |
| Icons | Lucide React |
| Images | Cloudinary (unsigned upload, CDN, WebP, responsive transforms) |
| Hosting | Vercel (frontend) + Convex Cloud (backend) |

## Features

- **Bilingual support** — Full English + Arabic with RTL layout via react-i18next
- **MD3 color system** — Material Design 3 palette with dark mode
- **Admin dashboard** — Clerk-protected admin panel for managing products, pages, quotes, and images
- **Product catalog** — Browse, search, and filter by category; bilingual content (name, description, specs)
- **Pages editor** — Block-based content editor (heading, text, image, list blocks) with bilingual support
- **Quote requests** — In-app quote form with Convex persistence
- **Cloudinary image upload** — Admin product form uploads directly to Cloudinary via unsigned preset; automatic WebP + responsive transforms
- **Responsive** — Mobile-first design with touch-aware interactions
- **Accessible** — Skip link, keyboard navigation, WCAG AA contrast, reduced-motion support, semantic landmarks
- **Performance** — CSS-only stagger animations, custom easing curves (expo-out, strong-out), compositor-only transform/opacity transitions, GPU-layer promotion

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
src/
├── admin/          # Admin dashboard pages + components
│   ├── components/ # AdminLayout, ProtectedRoute
│   └── pages/      # DashboardPage, AdminProductsPage, AdminProductFormPage,
│                   # AdminPagesPage, AdminQuotesPage, AdminImagesPage
├── components/
│   ├── layout/     # Header, Footer, Layout
│   └── ui/         # Button, Card, Badge, Input, SpecTable, CloudinaryUpload
├── i18n/
│   ├── config.ts   # i18next setup
│   └── locales/    # en.json, ar.json
├── lib/            # Convex client config, helpers, cloudinary.ts, localized.ts
├── pages/          # HomePage, AboutPage, ProductsPage, ProductDetailsPage,
│                   # IndustriesPage, ContactPage, RequestQuotePage
├── types/          # cloudinary.d.ts
├── App.tsx         # Router + direction setter
├── index.css       # Global styles, MD3 tokens, dark mode, RTL overrides
└── main.tsx        # Entry point

convex/
├── schema.ts       # Database schema (products, categories, quotes, pages, admins)
├── products.ts     # Product queries + mutations (bilingual)
├── categories.ts   # Category queries + mutations
├── quotes.ts       # Quote queries + mutations
├── pages.ts        # Pages queries + mutations (block-based content)
├── admins.ts       # Admin queries
├── images.ts       # Image upload mutations (Convex storage fallback)
├── seed.ts         # Seed data
└── migrate_ar.ts   # Arabic field migration
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npx convex dev` | Start Convex local dev server |
| `npx convex deploy` | Deploy Convex functions to production |
| `npx convex run` | Run a Convex function (query/mutation) |

## Deployment

Frontend is deployed to Vercel. Backend runs on Convex Cloud.

```bash
# Deploy Convex functions
npx convex deploy

# Deploy frontend (requires Vercel CLI)
npx vercel deploy --prod
```

Convex production URL and Clerk publishable key are set as Vercel environment variables.

## Design System

- **Primary / Logo Dark Blue**: `#2F5FA7` — buttons, headings, hero
- **Secondary / Logo Light Blue**: `#5A8EDB` — links, secondary buttons
- **Tertiary / CTA**: `#c84000` (orange) — call-to-action accents
- **Surface**: `#FFFFFF` — clean white background
- **Text**: `#1E1E1E` — body and headings
- **Muted**: `#5E5E5E` — secondary text (WCAG AA 4.5:1 compliant)
- **Outline**: `#7A7A7A` — borders, dividers (3:1 non-text threshold)
- **Utility tokens**: `pyramid-blue-dark`, `pyramid-blue-light`, `pyramid-gray`
- **Fonts**: Inter (headlines/buttons), IBM Plex Sans (body), IBM Plex Mono (data)
- **Font size tokens**: `--text-display-lg: 3.5rem`, `--text-headline-md: 1.5rem`, `--text-body-lg: 1.125rem`, `--text-body-sm: 0.875rem`, `--text-button-label: 0.875rem`, `--text-data-mono: 0.75rem`
- **Easing**: Custom cubic-bezier curves `--ease-out-expo` `(0.19, 1, 0.22, 1)`, `--ease-out-strong` `(0.23, 1, 0.32, 1)`, `--ease-in-out-strong` `(0.77, 0, 0.175, 1)`
- **Button press**: `scale(0.97)` at 120ms with `ease-out-strong`
- **Stagger entries**: translateY(8px) + opacity, 400ms, 60ms delay between items
- **Dark mode**: Inverted MD3 palette via `prefers-color-scheme: dark`

## License

All rights reserved. Fourth Pyramid Plastic Industries.
