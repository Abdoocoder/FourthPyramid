# Design System: Fourth Pyramid Plastic Industries

**Project:** Admin CMS + Corporate Website for Fourth Pyramid Plastic Industries
**Stack:** React + TypeScript + Tailwind CSS v4 + Convex
**Bilingual:** English / Arabic (RTL)

---

## 1. Design Philosophy

From PRODUCT.md — five principles that guide every decision:

1. **Clarity over decoration** — every element earns its place. The admin serves the operator, not the designer.
2. **Industrial confidence** — the UI feels as solid and reliable as the products it manages.
3. **Regional identity** — bilingual EN/AR, RTL support, design that doesn't feel imported from a US SaaS template.
4. **Low cognitive load** — operators manage real business data; reduce friction at every step.
5. **Calm authority** — not playful, not aggressive. Composed and in control.

The overall impression: **professional, reliable, regional.** An established Jordanian industrial manufacturer — grounded, not trendy. The interface should feel like a well-made tool: confident in its clarity, not trying to impress. Arabic-first company, bilingual interface.

---

## 2. Visual Theme

A composed industrial aesthetic — light and airy by default, with deep navy hero sections for contrast. Blue-anchored palette inspired by the Jordanian sky and the company's own brand identity. Clean surfaces, restrained decoration, generous whitespace with defined rhythm. The dark mode swaps to a deep charcoal canvas while preserving hierarchy.

- **Light mode:** Warm-neutral surface (#F4F7F9) with pure white containers and navy (#1A2B48) hero sections.
- **Dark mode:** Near-black surfaces (#0D1117) with shifted blue accent (#87B2E8) for readability.
- **Texture:** Subtle background images at low opacity (15-30%) for hero sections. No gradients, no heavy shadows, no glassmorphism.

---

## 3. Color Palette

### Light Mode
| Token | Value | Role |
|-------|-------|------|
| `--color-primary` | `#4A90E2` | Primary accent — buttons, links, active states |
| `--color-on-primary` | `#ffffff` | Text on primary |
| `--color-primary-container` | `#D6E8FF` | Soft blue container |
| `--color-on-primary-container` | `#001D36` | Text on primary container |
| `--color-secondary` | `#87B2E8` | Secondary accent — focus rings, highlights |
| `--color-tertiary` | `#C84000` | Tertiary/orange accent — caution, contrast moments |
| `--color-background` | `#F4F7F9` | Page background |
| `--color-on-background` | `#1A2B48` | Body text on background |
| `--color-surface` | `#ffffff` | Card/container surface |
| `--color-on-surface` | `#2C3E50` | Primary text on surface |
| `--color-on-surface-variant` | `#4B5563` | Secondary/muted text |
| `--color-surface-container` | `#ECEEF4` | Subtle container variant |
| `--color-surface-container-high` | `#E6E8EE` | Elevated container |
| `--color-surface-container-highest` | `#E1E8ED` | Highest container |
| `--color-outline` | `#7A7A7A` | Borders, dividers |
| `--color-outline-variant` | `#E1E8ED` | Subtle borders |
| `--color-error` | `#BA1A1A` | Error states |
| `--color-hero-surface` | `#1A2B48` | Hero section dark background |
| `--color-pyramid-blue` | `#4A90E2` | Brand blue |
| `--color-pyramid-navy` | `#1A2B48` | Brand navy |
| `--color-pyramid-sky` | `#87B2E8` | Brand sky |
| `--color-pyramid-slate` | `#2C3E50` | Brand slate |

### Dark Mode (prefers-color-scheme: dark)
- Primary shifts to `#87B2E8` for contrast against dark surfaces.
- Background and surfaces become deep charcoal (`#0D1117` and variants).
- Hero surface is the same as background.
- Image opacity reduced to 0.9.

### Banned Colors
- Pure black (#000000) — always off-black or brand navy
- Neon/fluorescent accents
- Purple/violet gradient combos
- Overly saturated accents above 80% saturation

---

## 4. Typography

| Token | Family | Size | Usage |
|-------|--------|------|-------|
| `font-display-lg` | Outfit, system-ui, sans-serif | `3.5rem` (clamp on responsive) | Hero titles, page headings |
| `font-headline-md` | Outfit, system-ui, sans-serif | `1.5rem` | Section headings |
| `font-button-label` | Outfit, system-ui, sans-serif | `0.875rem` | Button labels |
| `font-body-lg` | IBM Plex Sans, system-ui, sans-serif | `1.125rem` | Body text |
| `font-body-sm` | IBM Plex Sans, system-ui, sans-serif | `0.875rem` | Small body, metadata |
| `font-data-mono` | IBM Plex Mono, ui-monospace, monospace | `0.75rem` | Data labels, timestamps, metrics |

### RTL Override
When `dir="rtl"`, all font families switch to **Cairo** (a variable Arabic font with matching weights).

### Rules
- Display text uses tight tracking (`-0.025em` implied by Outfit's natural spacing).
- Body text uses relaxed leading (`1.65` via Tailwind default).
- Hero titles use `clamp(1.8rem, 4vw, 3rem)` to `clamp(2rem, 5vw, 3.5rem)` for fluid scaling.
- Never use `Inter` — IBM Plex Sans is the premium alternative.
- Never use generic serif fonts.

---

## 5. Space & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-margin-mobile` | `1rem` | Horizontal page margin on mobile |
| `spacing-margin-desktop` | `2rem` | Horizontal page margin on desktop |
| `spacing-gutter` | `1.5rem` | Grid gutter between columns |
| `spacing-container-max` | `1280px` | Max content width, centered |
| `spacing-section-gap` | `5rem` | Vertical gap between sections |

### Grid
- 12-column CSS Grid layout for page structure.
- Sections use `max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop`.
- Grid uses `gap-gutter` between columns.

### Breakpoints
- Default: Mobile-first
- `md:` at `768px` — tablet
- `lg:` at `1024px` — desktop

### Card Component
```tsx
// Surface fill, outline-variant border, rounded-xl
// Optional hover shadow: shadow-card-hover (0 4px 20px rgba(0,0,0,0.05))
// Optional onClick makes it interactive with button role
<Card hover onClick={handler}>
```

---

## 6. Component Patterns

### Buttons
| Variant | Style |
|---------|-------|
| `primary` | bg-primary text-on-primary, hover to primary-container |
| `secondary` | bg-surface, border-outline, hover to surface-container |
| `ghost` | text-primary, hover bg-surface-container-low |
| `tertiary` | bg-tertiary text-on-tertiary (orange) |
| `accent` | bg-surface, border-outline-variant, semibold |
| `dark` | bg-inverse-surface text-inverse-on-surface |
| `outline-light` | transparent, white border, for hero overlays |

Sizes: `sm` (px-5 py-3), `md` (px-6 py-4), `lg` (px-8 py-4).
Active state: `scale(0.97)` via CSS on all buttons/links.
Focus: 2px solid primary outline with 2px offset.
Disabled: opacity-50, cursor-not-allowed, pointer-events-none.

### Inputs & Forms
- Label above input with `gap-2` vertical stack.
- Required fields marked with red asterisk.
- Input base: bg-surface-bright, border-outline-variant, rounded-lg, px-4 py-3.
- Focus: border-secondary + ring-2 ring-secondary.
- Placeholder: on-surface-variant at 60% opacity.
- Select: custom chevron icon via pseudo-element.
- Textarea: resize-y, 5 rows default.

### Badge
- For tags, status indicators, category labels.

### SpecTable
- Used on ProductDetailsPage for technical specifications.

### Admin Layout
- Sidebar navigation (collapsible to hamburger on mobile).
- Content area with page header and table/grid views.
- Admin components use same surface/typography tokens as public site.

### Loaders & Empty States
- Skeletal loading patterns preferred.
- Empty states show composed guidance text with icons.

---

## 7. Motion & Animation

### Scroll Reveal (non-hero sections — REMOVED per Item 6)
No longer used below the fold. Hero entrance only.

### Hero Entrance (`usePageEntrance` in `src/lib/animations.ts`)
- GSAP-powered `fromTo` animation.
- Elements start at `{ opacity: 0, y: 28 }`, animate to `{ opacity: 1, y: 0 }`.
- Duration: 0.7s, stagger: 0.13-0.18s, ease: `power3.out`.

### Micro-interactions
- Button/link active: `scale(0.97)` over 120ms with `ease-out-strong`.
- Card hover: `translateY(-2px)` on devices with hover capability (`hover-lift` class).
- Staggered list entrance via `.stagger-item` CSS animation (opacity + translateY, 400ms, nth-child delay steps of 60ms).

### Easing Curves
| Token | Value | Usage |
|-------|-------|-------|
| `ease-out-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` | Entrance animations |
| `ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | Hover, micro-interactions |
| `ease-in-out-strong` | `cubic-bezier(0.77, 0, 0.175, 1)` | Complex transitions |

### Reduced Motion
`prefers-reduced-motion: reduce` strips all animation durations to 0.01ms and disables scroll-behavior. The `.stagger-item` class falls back to `opacity: 1` with no animation.

### Rules
- Animate only `transform` and `opacity` — never `top`, `left`, `width`, `height`.
- Use `will-change` on animated elements.
- GSAP used only for hero entrance (`usePageEntrance`). IntersectionObserver + CSS transitions used for scroll reveal.
- Admin sidebar mobile: spring physics for panel slide, stagger for nav items.

---

## 8. RTL Support

- Full layout swap via `dir="rtl"` attribute.
- Font family switches to **Cairo** for all text.
- Custom CSS overrides in `index.css` for: borders, padding, margins, order, text alignment, positioning.
- Divide/border utilities flipped (`border-r` becomes `border-l`-equivalent).
- Admin sidebar opens from the right in RTL mode.
- All i18n keys defined in both `en.json` and `ar.json`.

---

## 9. Dark Mode

- Triggered by `prefers-color-scheme: dark`.
- All surface, background, and text tokens swap.
- Primary shifts from `#4A90E2` → `#87B2E8` for contrast.
- Surfaces go deep charcoal: `#0D1117` (base), `#1A2028` (container), `#2E3743` (highest).
- Image opacity reduced to 0.9 for reduced luminance.
- No manual dark mode toggle — follows system preference.

---

## 10. Accessibility & Inclusion

- **WCAG AA** minimum compliance.
- **Touch targets:** ≥44px (min-h-11) for all interactive elements — filters, icon buttons, inputs, navigation items.
- **Focus indicators:** 2px solid `--color-primary` outline with 2px offset on all interactive elements.
- **Skip link:** Fixed at top of page, reveals on keyboard focus.
- **Reduced motion:** All animations respect `prefers-reduced-motion`.
- **Screen readers:** `aria-live="polite"` on dynamic content regions (product grids, admin tables, dashboard stats).
- **Forms:** Labels associated via `htmlFor`/`id`, required marks visible, error states with color + text.
- **Touch optimization:** `useFocusTrap` on modals/sidebars, `useBodyLock` for scroll prevention, swipe gestures on mobile panels.
- **ARIA:** Landmark regions (`<main>`, `<nav>`), `aria-hidden` on decorative elements, `aria-label` on icon-only buttons.

---

## 11. Admin CMS Patterns

- **Authentication:** Clerk-based, identity verified on every Convex mutation.
- **Data tables:** Striped rows, sortable columns, search/filter toolbar.
- **Forms:** Create/edit product forms with image upload via Cloudinary.
- **Quote management:** Inbox-style list with status indicators (new/contacted/resolved).
- **Image gallery:** Grid of uploaded product images with delete confirmation.
- **Dashboard:** Summary metrics (total products, recent quotes).
- **Sidebar:** Collapsible navigation with active page indicator, reusable `AdminLayout` wrapper.

---

## 12. Anti-Patterns (Banned)

| Pattern | Replacement |
|---------|-------------|
| Pure black (#000000) | Brand navy (#1A2B48) or off-black |
| Neon/purple gradients | Clean blue palette |
| Default shadcn/ui styling | Custom radii, colors, shadows per this system |
| 3-column equal card feature sections | Asymmetric bento grids, 2-col zig-zag |
| Centered hero (always) | Asymmetric or left-aligned heroes |
| Circular loading spinners | Skeletal shimmer |
| "Scroll to explore" text | Never — user knows how to scroll |
| Dark hacker aesthetic (neon on black) | Composed industrial light/dark |
| Generic Tailwind SaaS clone | Regional identity with custom tokens |
| Floating form labels | Top-aligned labels |
| Inter font | IBM Plex Sans / Outfit / Cairo for RTL |
| Glassmorphism / backdrop-blur on cards | Clean surface fills |
| h-screen (iOS Safari break) | min-h-[100dvh] |

---

## 13. File Architecture

```
src/
├── admin/
│   ├── components/        # AdminLayout, AdminSidebar, AdminTopBar
│   └── pages/             # DashboardPage, AdminProductsPage, AdminQuotesPage, AdminImagesPage
├── components/
│   └── ui/                # Button, Input, Card, Badge, SpecTable, CloudinaryUpload
├── lib/
│   ├── animations.ts      # useScrollReveal (IO), usePageEntrance (GSAP)
│   ├── localized.ts       # Bilingual field helpers
│   ├── constants.ts       # Site config, partners, industries
│   ├── cloudinary.ts      # Image transformation helpers
│   └── usePageTitle.ts    # Document title hook
├── pages/                 # HomePage, AboutPage, IndustriesPage, ProductsPage, ProductDetailsPage, ContactPage, RequestQuotePage
├── i18n/
│   └── locales/           # en.json, ar.json
└── index.css              # All design tokens, dark mode, RTL overrides, animations
```
