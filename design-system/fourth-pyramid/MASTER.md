# Design System Master File — Fourth Pyramid Plastic Industries

> Actual design system as built in the codebase. Reflects logo-based palette, bilingual (EN/AR) setup, and production state.

---

**Project:** Fourth Pyramid Plastic Industries
**Register:** Brand (corporate website)
**Stack:** React 19 + Vite 8 + Tailwind CSS 4 + Convex
**i18n:** react-i18next (English / Arabic with RTL)
**Auth:** Clerk (admin dashboard only)
**Images:** Cloudinary (unsigned upload, CDN, WebP, responsive transforms)
**Deployment:** Vercel (frontend) + Convex Cloud (backend)

---

## Color Palette (Logo-Based)

| Role | Hex | Token | Usage |
|------|-----|-------|-------|
| Primary | `#2F5FA7` | `--color-primary` | Buttons, headings, hero, links |
| On Primary | `#FFFFFF` | `--color-on-primary` | Text on primary backgrounds |
| Primary Container | `#D6E2FF` | `--color-primary-container` | Active nav, selected states |
| Secondary | `#5A8EDB` | `--color-secondary` | Links, secondary buttons |
| Tertiary / CTA | `#C84000` | `--color-tertiary` | Call-to-action accents |
| Background | `#FFFFFF` | `--color-background` | Page background |
| On Background | `#1E1E1E` | `--color-on-background` | Body text, headings |
| Surface | `#FFFFFF` | `--color-surface` | Card/component backgrounds |
| On Surface | `#1E1E1E` | `--color-on-surface` | Text on surfaces |
| On Surface Variant | `#5E5E5E` | `--color-on-surface-variant` | Secondary text (WCAG AA 4.5:1) |
| Outline | `#7A7A7A` | `--color-outline` | Borders, dividers (3:1 non-text) |
| Outline Variant | `#C4C6D0` | `--color-outline-variant` | Subtle borders |
| Error | `#BA1A1A` | `--color-error` | Error states |
| Utility | `#2F5FA7` | `--color-pyramid-blue-dark` | Brand reference |
| Utility | `#5A8EDB` | `--color-pyramid-blue-light` | Brand reference |
| Utility | `#7A7A7A` | `--color-pyramid-gray` | Brand reference |

### Dark Mode
All roles invert via `prefers-color-scheme: dark`. Primary becomes lighter (`#AAC1F5`), backgrounds become dark (`#121318`). Full 1:1 mapping in `src/index.css:187-244`.

### Contrast Note (P0 — Fixed)
`--color-on-surface-variant` was `#7A7A7A` (~4.15:1 on white, failed WCAG AA). Fixed to `#5E5E5E` (~5.8:1, passes AA).

---

## Typography

| Role | Font | Weight | Size Token |
|------|------|--------|------------|
| Display/Large Headings | Inter | 600, 700 | `--text-display-lg: 3.5rem` |
| Headlines | Inter | 600 | `--text-headline-md: 1.5rem` |
| Button Labels | Inter | 600 | `--text-button-label: 0.875rem` |
| Body Large | IBM Plex Sans | 400, 500 | `--text-body-lg: 1.125rem` |
| Body Small | IBM Plex Sans | 400 | `--text-body-sm: 0.875rem` |
| Data/Mono | IBM Plex Mono | 500 | `--text-data-mono: 0.75rem` |

### Arabic/Font (RTL Auto-Swap)
When `[dir="rtl"]`, all font variables swap to Cairo:
```css
[dir="rtl"] {
  --font-display-lg: Cairo, system-ui, sans-serif;
  --font-headline-md: Cairo, system-ui, sans-serif;
  --font-button-label: Cairo, system-ui, sans-serif;
  --font-body-lg: Cairo, system-ui, sans-serif;
  --font-body-sm: Cairo, system-ui, sans-serif;
  --font-data-mono: Cairo, ui-monospace, monospace;
}
```

Font size tokens: `display-lg: 3.5rem`, `headline-md: 1.5rem`, `body-lg: 1.125rem`, `body-sm: 0.875rem`, `button-label: 0.875rem`, `data-mono: 0.75rem`.

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-margin-mobile` | `1rem` | Side padding on mobile |
| `--spacing-margin-desktop` | `2rem` | Side padding on desktop |
| `--spacing-gutter` | `1.5rem` | Grid gap |
| `--spacing-container-max` | `1280px` | Max content width |
| `--spacing-section-gap` | `5rem` | Section vertical spacing |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-card-hover` | `0 4px 20px rgba(0,0,0,0.05)` | Card hover lift |

---

## Custom Easing

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` | Decorative animations |
| `--ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | UI interactions, button press |
| `--ease-in-out-strong` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen movement |

### Button Press
`scale(0.97)` at 120ms with `--ease-out-strong`. Applied globally via `button:active, [role="button"]:active, a:active`.

### Stagger Entry
Elements fade in with `translateY(8px)` → `translateY(0)`, 400ms, 60ms delay between items. `will-change: transform, opacity` for GPU promotion.

### Reduced Motion
All animations disabled via `prefers-reduced-motion: reduce` with `0.01ms` durations.

---

## Component Specs

### Button (`Button.tsx`)
- **Sizes**: `sm` (py-3, 13px), `md` (py-4, 14px), `lg` (py-4, 14px) — all ≥44px touch target
- **Variants**: primary, secondary, ghost, tertiary, accent, dark, outline-light
- **Press feedback**: `scale(0.97)` via global CSS (120ms, ease-out-strong)
- **Transitions**: background-color, color, box-shadow at 150ms ease-out
- **Hover**: `@media (hover: hover) and (pointer: fine)` gated

### Card (`Card.tsx`)
- **Shadow transition**: 300ms ease-out-strong on hover
- **Interactive**: role="button" + tabIndex + keyboard handler when onClick provided
- **No active scale** (handled globally by [role="button"]:active)

### Input (`Input.tsx`)
- **Touch target**: `py-3` (≥44px)
- **Label**: `htmlFor` + `id` association (WCAG 3.3.2)
- **Focus**: ring-2 ring-secondary

### Badge (`Badge.tsx`)
- **Variants**: primary, secondary, outline
- **Display only** (no interactive badges)

### SpecTable (`SpecTable.tsx`)
- **Semantic**: `<th scope="row">`, full `<table>` structure
- **Responsive**: w-full, wraps naturally

---

## Page Architecture

### Navigation
- **Desktop**: Top bar with logo + nav links + language toggle + CTA button
- **Mobile**: Hamburger menu → full-screen overlay drawer
- **Admin**: Collapsible sidebar (desktop) / slide-in drawer (mobile)

### Layout
- **Container**: `max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop`
- **Grid**: `grid-cols-1 md:grid-cols-12` with `gap-gutter`
- **Skip link**: Present, slides in on focus
- **Landmarks**: `<nav>`, `<main>`, `<footer>`, `<aside>` throughout

### Pages

| Route | Page | Notes |
|-------|------|-------|
| `/` | HomePage | Hero + metrics + categories + why us + CTA |
| `/products` | ProductsPage | Search + category filters + product cards |
| `/products/:slug` | ProductDetailsPage | Image gallery + specs + use cases + CTA |
| `/industries` | IndustriesPage | 4 industry sections + CTA |
| `/about` | AboutPage | Hero + intro + capabilities + quality + CTA |
| `/contact` | ContactPage | Form + contact info + map |
| `/request-quote` | RequestQuotePage | Form with validation |
| `/admin` | AdminLayout | Protected route, sidebar, 5 sub-pages |

---

## Responsive Behavior (Mobile-First)

| Breakpoint | Behavior |
|------------|----------|
| 360px+ | Single column, stacked layouts, hamburger nav |
| 768px+ | 2-column grids, visible nav links |
| 1024px+ | 3-4 column grids, full desktop layout |
| 1280px+ | Content capped at `max-w-container-max` |

### Touch Targets (WCAG 2.5.5)
- All buttons ≥44px touch target height (fixed `py-3` min)
- Admin action buttons: `p-2.5` (rounded-lg for visual padding)
- Mobile nav links: `py-3`
- Hamburger menu: `p-3`
- 8px+ gap between adjacent touch targets

### Admin Tables
- `overflow-x-auto` on table containers (not `overflow-hidden`)
- Cells with `truncate max-w-[200px]` to prevent overflow
- Hidden columns at `sm` and `md` breakpoints
- Status badges wrap naturally

### Thumbnail Grids
- Product gallery: `grid-cols-2 sm:grid-cols-4` (2 cols on mobile)
- Admin images: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`

---

## Accessibility (WCAG AA Goal)

- ✅ Skip link with keyboard focus
- ✅ `:focus-visible` outline (2px solid primary, 2px offset)
- ✅ `prefers-reduced-motion` respected (0.01ms override)
- ✅ Semantic landmarks (nav, main, footer, aside)
- ✅ `label htmlFor` + `input id` on all forms
- ✅ `aria-label` on icon-only buttons (language toggle, hamburger)
- ✅ `role="button"` + keyboard handler on interactive cards
- ✅ `<th scope="row">` in data tables
- ✅ Color not sole indicator (text + icon combos)
- ⚠️ `--color-on-surface-variant` fixed to `#5E5E5E` (WCAG AA 4.5:1)
- ⚠️ Search input on ProductsPage should add `aria-label` (placeholder only)
- ⚠️ Cloudinary upload button needs `aria-label`

---

## Anti-Patterns (Do NOT Use)

- ❌ **Gradient text** (`background-clip: text` with gradient)
- ❌ **Glassmorphism as default** (blur used functionally only)
- ❌ **Side-stripe borders** (colored left/right border >1px as accent)
- ❌ **Hero-metric template** (big number + small label repeated — exists on Home + About, noted)
- ❌ **Identical card grids** (same-sized cards with icon + heading + text)
- ❌ **Modal as first thought** (exhaust inline alternatives first)
- ❌ **`transition: all`** (always specify exact properties)
- ❌ **`scale(0)` entry animation** (start from 0.95 + opacity 0)
- ❌ **ease-in on UI elements** (use ease-out or custom curves)
- ❌ **Animation on keyboard actions** (remove entirely)
- ❌ **Em dashes** in editorial copy (use commas or periods)
- ❌ **Emojis as icons** (use Lucide React SVG icons)

---

## Pre-Delivery Checklist

- [x] No emojis as icons (Lucide React throughout)
- [x] All icons from consistent set (Lucide React)
- [x] `cursor-pointer` on all clickable elements
- [x] Hover states with smooth transitions (150-300ms, custom easing)
- [x] Light mode: text contrast 4.5:1 minimum (on-surface-variant fixed)
- [x] Focus states visible (`:focus-visible` with 2px primary outline)
- [x] `prefers-reduced-motion` respected
- [x] Responsive: 360px, 768px, 1024px, 1440px
- [x] No content hidden behind fixed navbars (header: h-20, main: pt-28)
- [x] No horizontal scroll on mobile (overflow-x-auto + truncate fixes)
