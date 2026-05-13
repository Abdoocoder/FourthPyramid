# Fourth Pyramid Plastic Industries

Corporate website for Fourth Pyramid Plastic Industries — a Jordan-based manufacturer of plastic packaging, industrial containers, chemical jerrycans, and commercial bottles.

Built with React 19, Vite 8, Tailwind CSS 4, and Convex for the backend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Vite 8 |
| Styling | Tailwind CSS 4, MD3 color system |
| Backend | Convex (realtime, edge-deployed) |
| Auth | Clerk (admin dashboard) |
| i18n | react-i18next (English / Arabic) |
| Icons | Lucide React |
| Hosting | Vercel (frontend) + Convex Cloud (backend) |

## Features

- **Bilingual support** — Full English + Arabic with RTL layout via react-i18next
- **MD3 color system** — Material Design 3 palette with dark mode
- **Admin dashboard** — Clerk-protected admin panel for managing products, quotes, and images
- **Product catalog** — Browse, search, and filter by category
- **Quote requests** — In-app quote form with Convex persistence
- **Responsive** — Mobile-first design with touch-aware interactions
- **Accessible** — Skip link, keyboard navigation, WCAG AA contrast, reduced-motion support
- **Performance** — CSS-only stagger animations, custom easing curves, transform/opacity-only transitions

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
```

## Project Structure

```
src/
├── admin/          # Admin dashboard pages + components
│   ├── components/ # AdminLayout, ProtectedRoute
│   └── pages/      # DashboardPage, AdminProductsPage, AdminQuotesPage, AdminImagesPage
├── components/
│   ├── layout/     # Header, Footer, Layout
│   └── ui/         # Button, Card, Badge, Input, SpecTable
├── i18n/
│   ├── config.ts   # i18next setup
│   └── locales/    # en.json, ar.json
├── lib/            # Convex client config, helpers, constants
├── pages/          # HomePage, AboutPage, ProductsPage, ProductDetailsPage,
│                   # IndustriesPage, ContactPage, RequestQuotePage
├── App.tsx         # Router + direction setter
├── index.css       # Global styles, MD3 tokens, RTL overrides
└── main.tsx        # Entry point

convex/
├── schema.ts       # Database schema (products, categories, quotes, admins)
├── products.ts     # Product queries + mutations
├── categories.ts   # Category queries + mutations
├── quotes.ts       # Quote queries + mutations
├── admins.ts       # Admin queries
└── seed.ts         # Seed data
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

- **Primary**: `#004ccd` (blue)
- **Tertiary / CTA**: `#c84000` (orange)
- **Fonts**: Inter (headlines), IBM Plex Sans (body), IBM Plex Mono (data)
- **Easing**: Custom cubic-bezier curves (expo-out, strong-out)
- **Dark mode**: Inverted MD3 palette via `prefers-color-scheme: dark`

## License

All rights reserved. Fourth Pyramid Plastic Industries.
