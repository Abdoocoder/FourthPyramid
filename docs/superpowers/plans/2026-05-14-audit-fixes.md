# Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 13 issues found in the `impeccable audit` — one P0 crash, three P1 WCAG violations, five P2 technical gaps, and four P3 anti-patterns.

**Architecture:** Fixes are independent and ordered by severity. Tasks 1–3 are correctness/crash fixes. Tasks 4–6 address WCAG. Tasks 7–9 are technical debt. Tasks 10–12 are design anti-pattern refactors. Each task produces a working, committable state on its own.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, GSAP 3, i18next, Vite, Vitest

---

## File Structure

| File | Tasks that modify it |
|------|----------------------|
| `src/lib/animations.ts` | Task 1 |
| `src/pages/HomePage.tsx` | Tasks 3, 4, 10, 11 |
| `src/components/layout/Header.tsx` | Task 2 |
| `src/components/layout/Layout.tsx` | Task 5 |
| `src/admin/components/AdminLayout.tsx` | Tasks 5, 7 |
| `src/components/ui/Skeleton.tsx` | Task 5 |
| `src/admin/components/ProtectedRoute.tsx` | Task 5 |
| `src/components/ScrollProgress.tsx` | Task 6 |
| `src/index.css` | Tasks 8, 9 |
| `src/components/ui/Button.tsx` | Task 12 |
| `src/pages/AboutPage.tsx` | Task 9 |
| `src/pages/RequestQuotePage.tsx` | Task 9 |
| `src/pages/ProductsPage.tsx` | Task 9 |
| `src/pages/ProductDetailsPage.tsx` | Task 9 |
| `src/pages/IndustriesPage.tsx` | Task 9 |
| `src/admin/pages/AdminQuotesPage.tsx` | Task 9 |
| `src/admin/pages/AdminProductsPage.tsx` | Task 9 |
| `src/admin/pages/AdminPagesPage.tsx` | Task 9 |
| `src/components/ui/SpecTable.tsx` | Task 9 |

---

## Task 1 — Fix P0 crash: `gsap` not imported in `animations.ts`

`usePageEntrance` uses `gsap` but never imports it. Any page calling this hook (`ContactPage`, `RequestQuotePage`, `ProductsPage`) crashes with `ReferenceError: gsap is not defined` when the entrance animation fires.

**Files:**
- Modify: `src/lib/animations.ts`

- [ ] **Step 1: Verify the crash**

Open `src/lib/animations.ts`. Confirm lines 95–103 reference `gsap.context` and `gsap.fromTo` with no import statement at the top of the file.

- [ ] **Step 2: Add the import**

Add `import gsap from "gsap";` as the second line of `src/lib/animations.ts`:

```ts
import { useEffect, type RefObject } from "react";
import gsap from "gsap";

export function useScrollReveal( ...
```

- [ ] **Step 3: Verify build passes**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npm run build 2>&1 | tail -20
```

Expected: `built in` with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/animations.ts
git commit -m "fix: import gsap in animations.ts — usePageEntrance was crashing ContactPage and RequestQuotePage"
```

---

## Task 2 — Fix P1 a11y: missing `aria-expanded` on mobile nav toggle

The hamburger button in `Header` has `aria-label="Toggle navigation"` but no `aria-expanded` state. Screen readers announce the button with no indication of whether the menu is open or closed. WCAG SC 4.1.2.

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Locate the button**

In `Header.tsx:82–88`, the mobile toggle button:

```tsx
<button
  className="md:hidden text-on-surface p-2.5 rounded-lg hover:bg-surface-container transition-colors"
  onClick={() => setMobileOpen(!mobileOpen)}
  aria-label="Toggle navigation"
>
```

- [ ] **Step 2: Add `aria-expanded` and `aria-controls`**

Replace those lines with:

```tsx
<button
  className="md:hidden text-on-surface p-2.5 rounded-lg hover:bg-surface-container transition-colors"
  onClick={() => setMobileOpen(!mobileOpen)}
  aria-label="Toggle navigation"
  aria-expanded={mobileOpen}
  aria-controls="mobile-nav"
>
```

- [ ] **Step 3: Add matching `id` to the mobile nav container**

The dropdown div at `Header.tsx:92` has no `id`. Add `id="mobile-nav"`:

```tsx
<div
  id="mobile-nav"
  className={`md:hidden bg-surface border-t border-outline-variant overflow-hidden transition-[max-height,opacity] duration-300 ease-out-strong ${
    mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
  }`}
  style={{ "--item-count": navLinks.length + 3 } as React.CSSProperties}
>
```

- [ ] **Step 4: Verify in browser**

Run `npm run dev` and open DevTools → Accessibility tree. The hamburger button should announce "Toggle navigation, expanded: false" in closed state and "…expanded: true" when open.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "fix(a11y): add aria-expanded and aria-controls to mobile nav toggle (WCAG 4.1.2)"
```

---

## Task 3 — Fix P1 a11y: nested `<main>` in `HomePage`

`Layout.tsx` already renders `<main id="main-content">`. `HomePage` renders its own `<main>` inside it, producing `<main><main>` — invalid HTML. Only one `<main>` landmark per page is allowed. WCAG SC 1.3.1.

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Find the nested `<main>`**

`HomePage.tsx:123`:
```tsx
<main className="overflow-x-hidden w-full max-w-full">
```

- [ ] **Step 2: Replace with `<div>`**

```tsx
<div className="overflow-x-hidden w-full max-w-full">
```

And close it at the matching `</main>` on the last line of the JSX (line 281):

```tsx
</div>
```

- [ ] **Step 3: Confirm no other pages have the same issue**

```bash
grep -rn "^  <main\|^    <main" /home/abdullah/Projects/fourth-pyramid-website/src/pages/ --include="*.tsx"
```

Expected: no results (all page content should use `<div>` or semantic section elements as root; the `<main>` lives in Layout).

- [ ] **Step 4: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "fix(a11y): replace nested <main> with <div> in HomePage (WCAG 1.3.1)"
```

---

## Task 4 — Fix P1 a11y: marquee has no keyboard-accessible pause control

The certifications marquee (`HomePage` lines 249–257) runs indefinitely. It pauses on `mouseenter`/`focusin` but the inner `<span>` elements are not focusable, so keyboard users can't trigger the focus event. WCAG SC 2.2.2 (Pause, Stop, Hide).

The simplest compliant fix: add a visually unobtrusive pause toggle button adjacent to the marquee. The marquee ref already manages the GSAP animation, so expose a ref to the tween.

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Refactor `useMarquee` to return a pause toggle**

Replace the existing `useMarquee` hook (lines 59–87) with a version that returns an `isPaused` state and a `toggle` function:

```tsx
function useMarquee(ref: React.RefObject<HTMLDivElement | null>) {
  const [isPaused, setIsPaused] = React.useState(false);
  const animRef = React.useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const track = el.querySelector(".marquee-track") as HTMLElement;
    if (!track) return;
    const clone = track.cloneNode(true) as HTMLElement;
    clone.setAttribute("aria-hidden", "true");
    el.appendChild(clone);
    const ctx = gsap.context(() => {
      animRef.current = gsap.to([track, clone], {
        xPercent: -50,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
    }, el);
    const pause = () => { animRef.current?.pause(); setIsPaused(true); };
    const resume = () => { animRef.current?.play(); setIsPaused(false); };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    return () => {
      ctx.revert();
      if (clone.parentNode === el) el.removeChild(clone);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [ref]);

  const toggle = React.useCallback(() => {
    if (animRef.current?.isActive() || !animRef.current?.paused()) {
      animRef.current?.pause();
      setIsPaused(true);
    } else {
      animRef.current?.play();
      setIsPaused(false);
    }
  }, []);

  return { isPaused, toggle };
}
```

Add `import React, { useRef, useEffect } from "react"` if not already present (check: `HomePage` already has `useRef` and `useEffect` imported).

- [ ] **Step 2: Update the call site and marquee JSX**

Replace `useMarquee(marqueeRef);` with:
```tsx
const { isPaused, toggle: toggleMarquee } = useMarquee(marqueeRef);
```

Replace the marquee `<section>` (lines 249–257) with:

```tsx
<section
  ref={marqueeRef}
  aria-label={t("home.certificationsBadges")}
  className="py-16 md:py-20 bg-surface-container-highest overflow-hidden border-y border-outline-variant relative"
>
  <button
    onClick={toggleMarquee}
    aria-label={isPaused ? t("home.resumeMarquee") : t("home.pauseMarquee")}
    className="absolute end-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface/80 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface transition-colors"
  >
    {isPaused ? (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
        <path d="M3 2l7 4-7 4V2z"/>
      </svg>
    ) : (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
        <rect x="2" y="2" width="3" height="8"/>
        <rect x="7" y="2" width="3" height="8"/>
      </svg>
    )}
  </button>
  <div className="flex marquee-track gap-12 items-center whitespace-nowrap">
    {partners.map((p, i) => (
      <span key={i} className="font-data-mono text-data-mono text-on-surface-variant/50 uppercase tracking-[0.2em] text-sm flex-shrink-0">
        {p}
      </span>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Add i18n keys**

Add to `src/i18n/locales/en.json` under `"home"`:
```json
"certificationsBadges": "Certifications and partnerships",
"pauseMarquee": "Pause certifications scroll",
"resumeMarquee": "Resume certifications scroll"
```

Add to `src/i18n/locales/ar.json` under `"home"`:
```json
"certificationsBadges": "الشهادات والشراكات",
"pauseMarquee": "إيقاف التمرير",
"resumeMarquee": "استئناف التمرير"
```

- [ ] **Step 4: Verify reduced motion**

The prefers-reduced-motion block in `index.css` strips all animation durations to `0.01ms`. The GSAP animation will not run under reduced motion. Confirm `useMarquee` doesn't crash when GSAP tween runs at near-zero duration — it won't, GSAP handles this gracefully.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/i18n/locales/en.json src/i18n/locales/ar.json
git commit -m "fix(a11y): add pause button to marquee for keyboard users (WCAG 2.2.2)"
```

---

## Task 5 — Fix P2 responsive: replace `min-h-screen` with `min-h-[100dvh]`

`min-h-screen` maps to `min-height: 100vh`. On iOS Safari the browser chrome is included in `100vh`, causing layout overflow. The design system bans `h-screen` and by extension `min-h-screen` for the same reason. `100dvh` uses the dynamic viewport height which excludes the browser chrome.

**Files:**
- Modify: `src/components/layout/Layout.tsx`
- Modify: `src/admin/components/AdminLayout.tsx`
- Modify: `src/components/ui/Skeleton.tsx`
- Modify: `src/admin/components/ProtectedRoute.tsx`

- [ ] **Step 1: `Layout.tsx` — line 8**

```tsx
// Before
<div className="bg-background text-on-background min-h-screen flex flex-col">

// After
<div className="bg-background text-on-background min-h-[100dvh] flex flex-col">
```

- [ ] **Step 2: `AdminLayout.tsx` — line 146**

```tsx
// Before
<div className="min-h-screen bg-surface-container-low flex">

// After
<div className="min-h-[100dvh] bg-surface-container-low flex">
```

- [ ] **Step 3: `Skeleton.tsx` — lines 58 and 76**

```tsx
// Line 58 — before
<div className="min-h-screen bg-surface-container-low flex">
// After
<div className="min-h-[100dvh] bg-surface-container-low flex">

// Line 76 — before
<div className="min-h-screen bg-surface-container-low flex items-center justify-center">
// After
<div className="min-h-[100dvh] bg-surface-container-low flex items-center justify-center">
```

- [ ] **Step 4: `ProtectedRoute.tsx` — line 14**

```tsx
// Before
<div className="min-h-screen flex items-center justify-center bg-surface-container-low p-4">

// After
<div className="min-h-[100dvh] flex items-center justify-center bg-surface-container-low p-4">
```

- [ ] **Step 5: Verify no remaining occurrences**

```bash
grep -rn "min-h-screen\|h-screen" /home/abdullah/Projects/fourth-pyramid-website/src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected: no results.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Layout.tsx src/admin/components/AdminLayout.tsx src/components/ui/Skeleton.tsx src/admin/components/ProtectedRoute.tsx
git commit -m "fix(responsive): replace min-h-screen with min-h-[100dvh] for iOS Safari viewport correctness"
```

---

## Task 6 — Fix P2 performance: animate ScrollProgress with `transform` not `width`

`ScrollProgress` animates `width` on every scroll tick. `width` is a layout property — it triggers the browser's layout recalculation pipeline on every frame. `transform: scaleX()` is GPU-composited and skips layout entirely.

**Files:**
- Modify: `src/components/ScrollProgress.tsx`

- [ ] **Step 1: Replace the inner bar's style**

Current `ScrollProgress.tsx`:
```tsx
<div
  className="h-full bg-primary transition-[width] duration-100 ease-out"
  style={{ width: `${progress * 100}%` }}
/>
```

Replace with:
```tsx
<div
  className="h-full w-full bg-primary transition-transform duration-100 ease-out origin-left will-change-transform"
  style={{ transform: `scaleX(${progress})` }}
/>
```

- The outer container already spans `left-0 right-0` (full width), so the inner bar scales from 0→1 in `scaleX`.
- `origin-left` ensures it grows from the left edge.
- `will-change-transform` hints GPU compositing.
- Remove `transition-[width]`; use `transition-transform`.

- [ ] **Step 2: Verify visual parity**

Run `npm run dev`. Scroll the page. The progress bar should track scroll position identically to before. The bar should start at the left edge and fill rightward.

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollProgress.tsx
git commit -m "perf: animate scroll progress bar with transform:scaleX instead of width (GPU compositing)"
```

---

## Task 7 — Fix P2 theming: `bg-black/40` overlay in AdminLayout

`bg-black/40` is pure black (`#000000`) at 40% opacity. The design system bans pure black; everything should be tinted toward brand navy. `bg-inverse-surface/50` uses the token `--color-inverse-surface` which in light mode is `#1A2B48` (brand navy) — correct.

**Files:**
- Modify: `src/admin/components/AdminLayout.tsx`

- [ ] **Step 1: Find and replace the overlay class**

`AdminLayout.tsx:148`:
```tsx
// Before
<div
  className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity duration-250 ease-out-strong ${
    sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  }`}
  onClick={closeSidebar}
  aria-hidden="true"
/>

// After
<div
  className={`fixed inset-0 bg-inverse-surface/50 z-30 md:hidden transition-opacity duration-250 ease-out-strong ${
    sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  }`}
  onClick={closeSidebar}
  aria-hidden="true"
/>
```

- [ ] **Step 2: Commit**

```bash
git add src/admin/components/AdminLayout.tsx
git commit -m "fix(theming): replace banned bg-black/40 with bg-inverse-surface/50 in admin overlay"
```

---

## Task 8 — Fix P2 theming: dark mode surface identical to background

In dark mode, `--color-surface` and `--color-background` are both `#0D1117`. Cards placed on the page background are visually invisible because both layers share the same color. Surface needs to be one step lighter to restore the elevation hierarchy.

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Find the dark mode surface token**

`index.css:285`:
```css
--color-surface: #0D1117;
```

- [ ] **Step 2: Shift `surface` to the next step up**

The token system already defines `--color-surface-container-low: #151A22` for dark mode at line 292. Use that value for `surface`:

```css
/* Inside @media (prefers-color-scheme: dark) → :root { ... } */

/* Before */
--color-surface: #0D1117;

/* After */
--color-surface: #151A22;
```

Also shift `--color-surface-bright` from `#2C3E50` to `#1A2028` (aligns with container-level) so it doesn't jump too far above surface:

```css
/* Before */
--color-surface-bright: #2C3E50;

/* After */
--color-surface-bright: #1A2028;
```

- [ ] **Step 3: Visual check in dark mode**

Toggle system dark mode (or add `prefers-color-scheme: dark` override in DevTools). Cards (white surface in light mode) should now be visibly distinct from the page background. The admin sidebar (fixed `bg-pyramid-navy`) is unaffected because it uses a named color, not the surface token.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "fix(theming): restore card/surface elevation in dark mode by separating surface from background color"
```

---

## Task 9 — Fix P2 responsive: migrate directional classes to RTL-safe logical properties

Tailwind v4 supports logical property utilities natively: `ps-*` (padding-inline-start), `pe-*` (padding-inline-end), `ms-*`, `me-*`, `start-*`, `end-*`, `border-s-*`, `border-e-*`, `text-start`, `text-end`. These automatically flip with `dir="rtl"` — eliminating the need for 20+ `[dir="rtl"]` CSS overrides in `index.css`.

This task migrates every physical directional class that has a CSS override to its logical equivalent, then removes the override block.

**Files:**
- Modify: `src/index.css`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/pages/IndustriesPage.tsx`
- Modify: `src/pages/RequestQuotePage.tsx`
- Modify: `src/pages/ProductsPage.tsx`
- Modify: `src/pages/ProductDetailsPage.tsx`
- Modify: `src/components/ui/SpecTable.tsx`
- Modify: `src/admin/pages/AdminQuotesPage.tsx`
- Modify: `src/admin/pages/AdminProductsPage.tsx`
- Modify: `src/admin/pages/AdminPagesPage.tsx`

- [ ] **Step 1: `AboutPage.tsx` — `md:pl-8` → `md:ps-8`**

`AboutPage.tsx:121`:
```tsx
// Before
<div className="reveal space-y-6 md:pl-8">
// After
<div className="reveal space-y-6 md:ps-8">
```

- [ ] **Step 2: `IndustriesPage.tsx` — `md:pl-8` → `md:ps-8`**

`IndustriesPage.tsx:69`:
```tsx
// Before
<div className="reveal md:col-span-5 md:pl-8">
// After
<div className="reveal md:col-span-5 md:ps-8">
```

- [ ] **Step 3: `RequestQuotePage.tsx` — `pr-0 md:pr-8` → `pe-0 md:pe-8`**

`RequestQuotePage.tsx:76`:
```tsx
// Before
<div ref={leftPanelRef} className="md:col-span-5 md:sticky md:top-32 pr-0 md:pr-8 mb-12 md:mb-0">
// After
<div ref={leftPanelRef} className="md:col-span-5 md:sticky md:top-32 pe-0 md:pe-8 mb-12 md:mb-0">
```

- [ ] **Step 4: `ProductsPage.tsx` — `left-0 pl-3 pl-10 left-2` → logical equivalents**

`ProductsPage.tsx:50–59`:
```tsx
// Before
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
...
className="block w-full pl-10 pr-3 py-3 border ...

// After
<div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
...
className="block w-full ps-10 pe-3 py-3 border ...
```

`ProductsPage.tsx:121`:
```tsx
// Before
<div className="absolute top-2 left-2">
// After
<div className="absolute top-2 start-2">
```

- [ ] **Step 5: `ProductDetailsPage.tsx` — `left-4` → `start-4`**

`ProductDetailsPage.tsx:138`:
```tsx
// Before
<div className="absolute top-4 left-4 bg-on-background ...
// After
<div className="absolute top-4 start-4 bg-on-background ...
```

- [ ] **Step 6: `SpecTable.tsx` — `pr-4 text-left` → `pe-4 text-start`**

`SpecTable.tsx:18`:
```tsx
// Before
<th scope="row" className="text-on-surface-variant uppercase tracking-wider py-3 pr-4 text-left ...
// After
<th scope="row" className="text-on-surface-variant uppercase tracking-wider py-3 pe-4 text-start ...
```

- [ ] **Step 7: `AdminQuotesPage.tsx` — `text-left` → `text-start` (4 occurrences)**

`AdminQuotesPage.tsx:47–50`:
```tsx
// Before — all four <th> tags have text-left
<th className="text-left px-6 py-4 ...

// After
<th className="text-start px-6 py-4 ...
```

Apply to all 4 `<th>` elements on those lines.

- [ ] **Step 8: `AdminProductsPage.tsx` — `left-3 pl-10 pl-10 text-left` → logical equivalents**

`AdminProductsPage.tsx:35`:
```tsx
// Before
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
// After
<Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
```

`AdminProductsPage.tsx:42`:
```tsx
// Before
className="w-full pl-10 pr-4 py-3 min-h-11 ...
// After
className="w-full ps-10 pe-4 py-3 min-h-11 ...
```

`AdminProductsPage.tsx:50–52` (3× `text-left`):
```tsx
// Before
<th className="text-left px-6 py-4 ...
// After (all three th elements)
<th className="text-start px-6 py-4 ...
```

- [ ] **Step 9: `AdminPagesPage.tsx` — `text-left` → `text-start` (2 occurrences)**

`AdminPagesPage.tsx:85` and `:98`:
```tsx
// Before
className={`w-full text-left px-4 py-2 ...
// After
className={`w-full text-start px-4 py-2 ...
```

- [ ] **Step 10: `Footer.tsx` — `md:text-left` → `md:text-start`**

`Footer.tsx:112`:
```tsx
// Before
<p className="font-body-sm text-body-sm text-on-surface-variant/80 text-center md:text-left">
// After
<p className="font-body-sm text-body-sm text-on-surface-variant/80 text-center md:text-start">
```

- [ ] **Step 11: Remove the RTL CSS override block from `index.css`**

Delete lines 320–374 — the entire block starting with `[dir="rtl"] .divide-x` through the final closing brace. Keep only the font-family override block that switches all fonts to Cairo in RTL (lines 368–375), since that cannot be done with Tailwind utilities.

The block to remove:
```css
[dir="rtl"] .divide-x > :not([hidden]) ~ :not([hidden]) { ... }
[dir="rtl"] .sm\:border-r { ... }
[dir="rtl"] .border-r-2 { ... }
[dir="rtl"] .md\:pl-8 { ... }
[dir="rtl"] .md\:pr-8 { ... }
[dir="rtl"] .md\:pr-0 { ... }
[dir="rtl"] .order-1 { order: 2; }
[dir="rtl"] .order-2 { order: 1; }
[dir="rtl"] .md\:order-1 { order: 2; }
[dir="rtl"] .md\:order-2 { order: 1; }
[dir="rtl"] .pl-10 { ... }
[dir="rtl"] .pl-3 { ... }
[dir="rtl"] .left-0 { ... }
[dir="rtl"] .left-2 { ... }
[dir="rtl"] .left-4 { ... }
[dir="rtl"] .-left-4 { ... }
[dir="rtl"] .left-3 { ... }
[dir="rtl"] .right-0 { ... }
[dir="rtl"] .text-left { ... }
[dir="rtl"] .text-right { ... }
[dir="rtl"] .sm\:text-left { ... }
```

Keep:
```css
[dir="rtl"] {
  --font-display-lg: Cairo, system-ui, sans-serif;
  ...
}
```

- [ ] **Step 12: Verify RTL visually**

In DevTools, temporarily set `document.documentElement.dir = "rtl"`. Navigate through Products, RequestQuote, Contact, ProductDetails, About, Industries, Admin pages. Confirm that:
- Search input icon aligns to the right
- Padding on left-panel descriptions is on the right side
- Table headers align right
- Product detail badge is positioned top-right
- No layout breaks

- [ ] **Step 13: Commit**

```bash
git add src/index.css src/pages/AboutPage.tsx src/pages/IndustriesPage.tsx src/pages/RequestQuotePage.tsx src/pages/ProductsPage.tsx src/pages/ProductDetailsPage.tsx src/components/ui/SpecTable.tsx src/admin/pages/AdminQuotesPage.tsx src/admin/pages/AdminProductsPage.tsx src/admin/pages/AdminPagesPage.tsx src/components/layout/Footer.tsx
git commit -m "fix(rtl): migrate physical directional classes to Tailwind v4 logical properties, remove CSS override block"
```

---

## Task 10 — Fix P3 theming: hardcoded `text-[13px]` in Button

`Button.tsx:33` has `text-[13px]` for the `sm` size — an arbitrary value outside the token system. The closest token is `text-button-label` (`0.875rem` = 14px). For a `sm` button, `text-xs` (`0.75rem` = 12px) is the right step down.

**Files:**
- Modify: `src/components/ui/Button.tsx`

- [ ] **Step 1: Replace the arbitrary value**

`Button.tsx:33`:
```ts
// Before
sm: "px-5 py-3 text-[13px]",

// After
sm: "px-5 py-3 text-xs",
```

- [ ] **Step 2: Run existing tests**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx vitest run src/components/ui/__tests__/Button.test.tsx 2>&1
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "fix(theming): replace arbitrary text-[13px] with text-xs token in Button sm size"
```

---

## Task 11 — Fix P3 anti-pattern: hero-metric template in `HomePage`

The 4-up grid of big numbers (`1998 / 50M+ / 25+ / ISO`) is the banned "hero-metric template." Replace with an asymmetric two-column layout: a featured narrative stat on the left and a compact vertical list of supporting stats on the right. This tells a story instead of stacking identical number blocks.

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Replace the metrics section**

Find the `<section ref={metricsRef}>` block (lines 158–171) and replace it entirely:

```tsx
<section ref={metricsRef} className="py-24 md:py-32 bg-surface border-b border-outline-variant">
  <div className="max-w-6xl mx-auto px-6 md:px-8">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
      {/* Featured stat — left */}
      <div className="metric-card md:col-span-5 flex flex-col gap-4 border-e border-outline-variant md:pe-12">
        <MetricValue metric={metrics[2]} />
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-[40ch]">
          {t("home.yearsExpContext")}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-data-mono text-data-mono text-primary uppercase tracking-[0.15em] text-[11px]">
            {t("home.established")} {metrics[0].value}
          </span>
          <span className="w-8 h-px bg-outline" />
          <span className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-[0.15em] text-[11px]">
            {t("home.amman")}
          </span>
        </div>
      </div>

      {/* Supporting stats — right */}
      <div className="metric-card md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 md:ps-4">
        {[metrics[0], metrics[1], metrics[3]].map((m) => (
          <div key={m.key} className="flex flex-col gap-2">
            <MetricValue metric={m} />
            <span className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-[0.15em] text-[11px]">
              {t(`home.${m.key}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add the `yearsExpContext` and `amman` i18n keys**

`src/i18n/locales/en.json` under `"home"`:
```json
"yearsExpContext": "Manufacturing precision plastic packaging for Jordan's leading industrial sectors since 1998.",
"amman": "Amman, Jordan"
```

`src/i18n/locales/ar.json` under `"home"`:
```json
"yearsExpContext": "تصنيع عبوات بلاستيكية دقيقة للقطاعات الصناعية الأردنية الرائدة منذ عام 1998.",
"amman": "عمان، الأردن"
```

- [ ] **Step 3: Verify `metricsRef` scroll reveal still works**

The `useScrollReveal(metricsRef, ".metric-card", 0.1)` call targets `.metric-card`. The replacement uses `metric-card` on the two child divs — ensure both child divs carry that class (they do in the code above).

- [ ] **Step 4: Commit**

```bash
git add src/pages/HomePage.tsx src/i18n/locales/en.json src/i18n/locales/ar.json
git commit -m "refactor(design): replace hero-metric 4-up grid with asymmetric narrative stat layout (anti-pattern fix)"
```

---

## Task 12 — Fix P3 anti-pattern: identical 3-card "Why Choose Us" grid

Three identical cards with the same structure (stat + heading + body + index number) is the "identical card grids" anti-pattern. Break the uniformity with a bento layout: card 1 spans 2 columns with added context, cards 2–3 are compact on the right.

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Replace the why section grid**

Find the `<section ref={whyRef}>` block (lines 214–247) and replace the inner grid:

```tsx
<section ref={whyRef} className="py-24 md:py-32 bg-surface">
  <div className="max-w-6xl mx-auto px-6 md:px-8">
    <div className="text-center mb-16">
      <h2 className="reveal font-display-lg text-[clamp(2rem,4vw,3.5rem)] text-on-surface leading-[1.05] tracking-[-0.02em] max-w-3xl mx-auto">
        {t("home.whyTitle")}
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Card 1 — featured, spans 7 cols */}
      <div className="why-card hover-lift group md:col-span-7 relative bg-surface-container-low border border-outline-variant rounded-2xl p-8 md:p-10 hover:border-primary/30 transition-colors duration-300 flex flex-col justify-between gap-8 min-h-[280px]">
        <div>
          <span className="font-display-lg text-[clamp(3rem,6vw,5rem)] text-primary leading-none block mb-4">
            25+
          </span>
          <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">{t("home.reason1Title")}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed max-w-[45ch]">
            {t("home.reason1Desc")}
          </p>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-outline-variant">
          <span className="font-data-mono text-data-mono text-[11px] text-on-surface-variant/40 uppercase tracking-widest">
            01
          </span>
          <span className="w-6 h-px bg-outline-variant" />
          <span className="font-data-mono text-data-mono text-[11px] text-primary uppercase tracking-widest">
            {t("home.established")} 1998
          </span>
        </div>
      </div>

      {/* Cards 2 & 3 — compact, stack in remaining 5 cols */}
      <div className="md:col-span-5 flex flex-col gap-6">
        {[
          { titleKey: "reason2Title", stat: "ISO", descKey: "reason2Desc", index: "02" },
          { titleKey: "reason3Title", stat: "100%", descKey: "reason3Desc", index: "03" },
        ].map((s) => (
          <div
            key={s.titleKey}
            className="why-card hover-lift group relative bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors duration-300 flex flex-col gap-4 flex-1"
          >
            <span className="font-display-lg text-[clamp(2rem,3vw,2.5rem)] text-primary leading-none">
              {s.stat}
            </span>
            <div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface mb-1">{t(`home.${s.titleKey}`)}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{t(`home.${s.descKey}`)}</p>
            </div>
            <span className="font-data-mono text-data-mono text-[11px] text-on-surface-variant/30 uppercase tracking-widest mt-auto">
              {s.index}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify scroll reveal selectors still match**

`useScrollReveal(whyRef, ".why-card, .reveal", 0.12)` targets `.why-card`. All three cards in the replacement carry `why-card` — confirmed.

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -10
```

Expected: clean build, no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "refactor(design): break identical 3-card why-grid into bento layout with featured card (anti-pattern fix)"
```

---

## Self-Review

### Spec coverage

| Audit finding | Task |
|---|---|
| P0 gsap crash in animations.ts | Task 1 ✅ |
| P1 missing aria-expanded | Task 2 ✅ |
| P1 nested main in HomePage | Task 3 ✅ |
| P1 marquee no keyboard pause | Task 4 ✅ |
| P2 min-h-screen / iOS Safari | Task 5 ✅ |
| P2 ScrollProgress width animation | Task 6 ✅ |
| P2 bg-black/40 overlay | Task 7 ✅ |
| P2 dark mode surface=background | Task 8 ✅ |
| P2 RTL brittle CSS overrides | Task 9 ✅ |
| P3 text-[13px] in Button | Task 10 ✅ |
| P3 hero-metric template | Task 11 ✅ |
| P3 identical 3-card grid | Task 12 ✅ |

### Notes

- `AdminLayout.tsx` also has a 3px left-bar active indicator (`absolute left-0 ... w-[3px]`). This is a sidebar nav affordance, not a "side-stripe border as card decoration" — it's intentional and exempt from the ban per the design system's own sidebar pattern. Not addressed.
- The `ScrollProgress` outer container uses `left-0 right-0` — these are physical classes. However, a scroll progress bar at the top is directionally neutral (fills LTR visually regardless of text direction), so no change needed.
- Task 4 uses `React.useState` and `React.useCallback` — confirm `React` is imported in `HomePage.tsx`. It is via the auto-JSX transform in Vite; however, `useState` and `useCallback` are already imported. Replace `React.useState` with `useState` and `React.useCallback` with `useCallback` in the hook body to match the existing import style.
