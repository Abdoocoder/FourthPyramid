# Animation System Design — Fourth Pyramid Website

**Date:** 2026-05-14  
**Stack:** Vite + React 19 + TypeScript + GSAP 3 + Tailwind v4

---

## Scope

Add 5 premium animation layers across all public pages. Admin pages are excluded.

## What Already Exists (keep as-is)

- `useScrollReveal` / `useScrollRevealGroup` / `usePageEntrance` in `src/lib/animations.ts`
- `useMarquee` in `HomePage.tsx`
- GSAP + `@gsap/react` already installed

## New Additions

### 1. MagneticCursor + TouchRipple — `src/components/MagneticCursor.tsx`

**Desktop:** Two-layer cursor — a fast dot (`w-2 h-2`) + a lagging circle (`w-10 h-10 border`). Uses `gsap.ticker` for the lag loop. Detect touch device via `window.matchMedia('(pointer: coarse)')` — if true, render nothing but wire the TouchRipple instead.

**Mobile/Tablet:** A `<div>` injected at touch coordinates that scales from 0→1 then fades out in ~400ms. Implemented with GSAP, appended to `document.body` on each `touchstart`.

Colors use CSS custom property `var(--color-primary)` — no hardcoded amber.

Added to `Layout.tsx` above `<Header />`.

---

### 2. PageLoader — `src/components/PageLoader.tsx`

Two full-height panels (`left: bg-surface-container-highest`, `right: bg-primary`) that `scaleX` from 1→0 after 400ms delay, `transformOrigin: left`. Timeline completes in ~900ms then component unmounts (`useState(done)`).

Added to `Layout.tsx` as first child of the outer div (above ScrollProgress).

---

### 3. `useMagneticButton` — added to `src/lib/animations.ts`

```ts
useMagneticButton(ref: RefObject<HTMLElement | null>, strength = 0.35)
```

Attaches `mousemove` + `mouseleave` on the element. On move: calculates offset from center, GSAP.to `x/y`. On leave: GSAP.to `x:0, y:0` with `elastic.out(1, 0.4)`. Skipped if `prefersReduced()`.

Applied to: all `<Button>` primary CTAs (Request Quote, View Products, Contact Us).

---

### 4. `useTiltCard` — added to `src/lib/animations.ts`

```ts
useTiltCard(ref: RefObject<HTMLElement | null>, maxDeg = 12)
```

On `mousemove`: `rotationX`, `rotationY` relative to card center. On `mouseleave`: resets with `elastic.out`. Sets `transformPerspective: 900` once. Skipped if `prefersReduced()` or touch device.

Applied to: product cards in `ProductsPage.tsx` and `ProductDetailsPage.tsx`, capability cards in `HomePage.tsx`.

---

### 5. `useScramble` — added to `src/lib/animations.ts`

```ts
useScramble(finalText: string, trigger?: boolean): RefObject<HTMLSpanElement>
```

Uses `setInterval` at 16ms. Chars pool includes Latin + Arabic characters. Resolves left-to-right over ~800ms (50 frames). Clears on unmount. Triggered once on mount (no scroll dependency — hero headings are above the fold).

Applied to: `<h1>` hero spans in `HomePage.tsx` and `AboutPage.tsx`.

---

## File Changes Summary

| File | Change |
|---|---|
| `src/components/MagneticCursor.tsx` | **New** |
| `src/components/PageLoader.tsx` | **New** |
| `src/lib/animations.ts` | Add `useMagneticButton`, `useTiltCard`, `useScramble` |
| `src/components/layout/Layout.tsx` | Add `<PageLoader />` and `<MagneticCursor />` |
| `src/pages/HomePage.tsx` | Apply `useScramble` on h1, `useTiltCard` on cap-cards |
| `src/pages/AboutPage.tsx` | Apply `useScramble` on h1 |
| `src/pages/ProductsPage.tsx` | Apply `useTiltCard` on product cards |
| `src/pages/ProductDetailsPage.tsx` | Apply `useTiltCard` on product card/image |
| `src/components/ui/Button.tsx` | Apply `useMagneticButton` internally |

## Accessibility

- All motion effects check `prefersReduced()` (already defined in `animations.ts`) and bail early
- Touch ripple has `aria-hidden="true"` and `pointer-events: none`
- PageLoader unmounts after animation — no persistent DOM cost
- Magnetic cursor has `pointer-events: none` — never blocks interaction

## Non-Goals

- No Three.js / WebGL (overkill for B2B site)
- No GSAP ScrollTrigger plugin (not needed — existing IntersectionObserver pattern is sufficient)
- No changes to admin pages
