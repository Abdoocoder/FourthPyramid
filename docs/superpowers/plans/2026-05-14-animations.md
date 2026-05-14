# Animation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add MagneticCursor/TouchRipple, PageLoader, useMagneticButton, useTiltCard, and useScramble across all public pages of the Fourth Pyramid website.

**Architecture:** New components live in `src/components/`, new hooks are appended to the existing `src/lib/animations.ts`. Layout.tsx mounts the global components once. Pages wire hooks locally.

**Tech Stack:** React 19, TypeScript, GSAP 3, Tailwind v4, Vite

---

## File Map

| File | Action |
|---|---|
| `src/components/MagneticCursor.tsx` | Create |
| `src/components/PageLoader.tsx` | Create |
| `src/lib/animations.ts` | Append 3 hooks |
| `src/components/layout/Layout.tsx` | Add 2 components |
| `src/components/ui/Button.tsx` | Add magnetic ref + handlers |
| `src/pages/HomePage.tsx` | useScramble on h1, useTiltCard on cap-cards |
| `src/pages/AboutPage.tsx` | useScramble on h1 |
| `src/pages/ProductsPage.tsx` | useTiltCard on product cards |
| `src/pages/ProductDetailsPage.tsx` | useTiltCard on product image/card |

---

## Task 1: Create MagneticCursor component

**Files:**
- Create: `src/components/MagneticCursor.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function TouchRipple() {
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      const ripple = document.createElement("div");
      ripple.setAttribute("aria-hidden", "true");
      Object.assign(ripple.style, {
        position: "fixed",
        left: `${touch.clientX}px`,
        top: `${touch.clientY}px`,
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1.5px solid var(--color-primary)",
        transform: "translate(-50%, -50%) scale(0)",
        opacity: "0.7",
        pointerEvents: "none",
        zIndex: "9999",
      });
      document.body.appendChild(ripple);
      gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    };
    document.addEventListener("touchstart", handleTouch, { passive: true });
    return () => document.removeEventListener("touchstart", handleTouch);
  }, []);
  return null;
}

function DesktopCursor() {
  const circleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const circle = circleRef.current;
    const dot = dotRef.current;
    if (!circle || !dot) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "none" });
    };

    const ticker = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1;
      gsap.set(circle, { x: pos.current.x, y: pos.current.y });
    };

    document.addEventListener("mousemove", onMove);
    gsap.ticker.add(ticker);
    return () => {
      document.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <>
      <div
        ref={circleRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-primary/60 mix-blend-difference"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
      />
    </>
  );
}

export function MagneticCursor() {
  if (isTouchDevice()) return <TouchRipple />;
  return <DesktopCursor />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to MagneticCursor.tsx

---

## Task 2: Create PageLoader component

**Files:**
- Create: `src/components/PageLoader.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function PageLoader() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const tl = gsap.timeline({ onComplete: () => setDone(true) });
    tl.to([leftRef.current, rightRef.current], {
      scaleX: 0,
      duration: 0.85,
      ease: "power3.inOut",
      transformOrigin: "left center",
      stagger: 0.07,
      delay: 0.3,
    });
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex pointer-events-none" aria-hidden="true">
      <div ref={leftRef} className="flex-1 origin-left bg-surface-container-highest" />
      <div ref={rightRef} className="flex-1 origin-left bg-primary" />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

---

## Task 3: Add useMagneticButton, useTiltCard, useScramble to animations.ts

**Files:**
- Modify: `src/lib/animations.ts`

- [ ] **Step 1: Append the three hooks at the end of the file**

Add after the last export in `src/lib/animations.ts`:

```ts
export function useMagneticButton(
  ref: RefObject<HTMLElement | null>,
  strength = 0.35
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength]);
}

export function useTiltCard(
  ref: RefObject<HTMLElement | null>,
  maxDeg = 12
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, {
        rotationY: x * maxDeg,
        rotationX: -y * maxDeg,
        duration: 0.4,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "elastic.out(1,0.4)",
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, maxDeg]);
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZابجدهوزحطيكلمن0123456789";

export function useScramble(
  finalText: string,
  trigger = true
): RefObject<HTMLSpanElement | null> {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !trigger || prefersReduced()) {
      if (el) el.textContent = finalText;
      return;
    }
    const totalFrames = 50;
    let frame = 0;
    el.textContent = finalText;

    const iv = setInterval(() => {
      el.textContent = finalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (frame / totalFrames > i / finalText.length) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");
      if (++frame >= totalFrames) {
        clearInterval(iv);
        el.textContent = finalText;
      }
    }, 16);

    return () => {
      clearInterval(iv);
      if (el) el.textContent = finalText;
    };
  }, [finalText, trigger]);

  return ref;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

---

## Task 4: Wire global components into Layout.tsx

**Files:**
- Modify: `src/components/layout/Layout.tsx`

- [ ] **Step 1: Add imports and components**

Add to imports at top:
```tsx
import { MagneticCursor } from "../MagneticCursor";
import { PageLoader } from "../PageLoader";
```

Change Layout return — add `<PageLoader />` and `<MagneticCursor />` as first two children:
```tsx
export function Layout() {
  return (
    <div className="bg-background text-on-background min-h-[100dvh] flex flex-col">
      <PageLoader />
      <MagneticCursor />
      <ScrollProgress />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-20" tabIndex={-1}>
        <div className="page-entrance">
          <Outlet />
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit 2>&1 | head -20
```

---

## Task 5: Add useMagneticButton to Button.tsx

**Files:**
- Modify: `src/components/ui/Button.tsx`

- [ ] **Step 1: Wire useMagneticButton into the button element**

The `<a>` variant cannot use the hook (it's a link, not interactive in the same way). Apply only to `<button>`:

Replace the Button component with:
```tsx
import { useRef, type ButtonHTMLAttributes } from "react";
import { useMagneticButton } from "../../lib/animations";

type Variant = "primary" | "secondary" | "ghost" | "tertiary" | "accent" | "dark" | "outline-light";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm hover:shadow-card-hover",
  secondary:
    "bg-surface text-on-surface border border-outline-variant hover:bg-surface-container hover:border-outline",
  ghost:
    "text-primary hover:bg-surface-container-low hover:text-on-primary-container",
  tertiary:
    "bg-tertiary text-on-tertiary hover:bg-tertiary-container hover:text-on-tertiary-container shadow-sm hover:shadow-card-hover",
  accent:
    "bg-surface text-on-surface hover:bg-surface-container border border-outline-variant font-semibold",
  dark:
    "bg-inverse-surface text-inverse-on-surface hover:bg-pyramid-slate border-none",
  "outline-light":
    "bg-transparent text-inverse-on-surface border border-inverse-on-surface/30 hover:bg-inverse-on-surface/10",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-3 text-xs",
  md: "px-6 py-4 text-button-label",
  lg: "px-8 py-4 text-button-label",
};

export function Button({
  variant = "primary",
  size = "md",
  as = "button",
  href,
  target,
  rel,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg font-button-label cursor-pointer select-none motion-reduce:active:scale-100 hover-lift-btn transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out-strong disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";
  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const btnRef = useRef<HTMLButtonElement>(null);
  useMagneticButton(btnRef);

  if (as === "a" && href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        target={target ?? (isExternal ? "_blank" : undefined)}
        rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
      >
        {children}
      </a>
    );
  }

  return (
    <button ref={btnRef} className={classes} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit 2>&1 | head -20
```

---

## Task 6: Apply useScramble on HomePage h1

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Import and apply useScramble**

Add `useScramble` to the import line:
```tsx
import { useScrollReveal, useScramble } from "../lib/animations";
```

Inside `HomePage()`, before the return, add:
```tsx
const { t } = useTranslation();
// ... existing code ...
const heroTitleRef = useScramble(t("home.heroTitle"));
```

In the JSX, wrap the first text in h1 with the ref:
```tsx
<h1 className="font-display-lg text-[clamp(2.5rem,5vw,4.5rem)] text-inverse-on-surface leading-[1.05] tracking-[-0.02em] mb-6">
  <span ref={heroTitleRef}>{t("home.heroTitle")}</span>
  {" "}
  <span
    className="inline-block w-16 h-8 md:w-24 md:h-12 rounded-full align-middle mx-2 bg-cover bg-center"
    style={{ backgroundImage: `url(${HERO_IMAGE.replace("w=1920", "w=200")}&h=200&fit=crop)` }}
  />
  {" "}
  <span className="text-primary">{t("home.heroTitleAccent")}</span>
</h1>
```

- [ ] **Step 2: Apply useTiltCard on capability cards**

Add `useTiltCard` to the import line:
```tsx
import { useScrollReveal, useScramble, useTiltCard } from "../lib/animations";
```

The cap-cards are rendered inside a `.map()`, so create a `CapCard` sub-component that uses the hook:

Add above `HomePage`:
```tsx
function CapCard({ cat, i }: { cat: { slug: string; icon: string; name_en?: string; name_ar?: string; description_en?: string; description_ar?: string }, i: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  useTiltCard(cardRef as unknown as React.RefObject<HTMLElement | null>);
  // ... same JSX as the existing Link block, but with ref={cardRef}
}
```

Actually, a simpler approach: use a wrapper div with the tilt hook since `useTiltCard` targets `HTMLElement`. Replace the `<Link>` cap-card with:

```tsx
function TiltCapCard({ cat, i, layout }: { cat: ReturnType<typeof useQuery<typeof api.categories.list>>[number]; i: number; layout: string }) {
  const tiltRef = useRef<HTMLDivElement>(null);
  useTiltCard(tiltRef);
  return (
    <div ref={tiltRef} className={`${layout}`}>
      <Link
        to={`/products?category=${cat.slug}`}
        className="cap-card hover-lift group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-[0_1px_0_rgba(26,43,72,0.03)] transition-[border-color,box-shadow,transform,background-color] duration-300 ease-out-strong hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover motion-reduce:hover:translate-y-0 block h-full"
      >
        {/* same inner JSX */}
      </Link>
    </div>
  );
}
```

> **Note:** Due to complexity of the cat type from Convex API, it is simpler to just attach the tiltRef directly to the existing Link element via a wrapper div. Keep the existing Link JSX unchanged inside.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit 2>&1 | head -30
```

---

## Task 7: Apply useScramble on AboutPage h1

**Files:**
- Modify: `src/pages/AboutPage.tsx`

- [ ] **Step 1: Import and apply**

Add `useScramble` to import:
```tsx
import { useScrollReveal, useImageReveal, usePageEntrance, useScramble } from "../lib/animations";
```

Inside `AboutPage()`, add:
```tsx
const heroTitleRef = useScramble(t("about.heroTitle"));
```

Find the `<h1>` inside the hero section and wrap its text with the ref:
```tsx
<h1 className="...existing classes...">
  <span ref={heroTitleRef}>{t("about.heroTitle")}</span>
</h1>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit 2>&1 | head -20
```

---

## Task 8: Apply useTiltCard on ProductsPage cards

**Files:**
- Modify: `src/pages/ProductsPage.tsx`

- [ ] **Step 1: Create TiltProductCard wrapper**

Add `useTiltCard` to import:
```tsx
import { usePageEntrance, useTiltCard } from "../lib/animations";
```

Add a wrapper component above `ProductsPage`:
```tsx
function TiltProductCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useTiltCard(ref, 8);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

Then in the products grid, wrap each `<Card>` (or the product link) with `<TiltProductCard>`.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit 2>&1 | head -20
```

---

## Task 9: Final build check

- [ ] **Step 1: Full TypeScript check**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Lint check**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && npx eslint src/components/MagneticCursor.tsx src/components/PageLoader.tsx src/lib/animations.ts --max-warnings 0
```

- [ ] **Step 3: Commit**

```bash
cd /home/abdullah/Projects/fourth-pyramid-website && git add src/components/MagneticCursor.tsx src/components/PageLoader.tsx src/lib/animations.ts src/components/layout/Layout.tsx src/components/ui/Button.tsx src/pages/HomePage.tsx src/pages/AboutPage.tsx src/pages/ProductsPage.tsx && git commit -m "feat: add premium animation system (cursor, loader, tilt, scramble, magnetic)"
```
