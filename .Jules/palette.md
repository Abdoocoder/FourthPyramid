## 2026-05-31 - [Mobile Navigation Accessibility]
**Learning:** Mobile navigation panels must include both `aria-hidden` and the `inert` attribute (controlled by the open state) to ensure closed menus are correctly removed from the accessibility tree and focus order in this app's layout structure.
**Action:** Always check for `aria-hidden` and `inert` on mobile overlays/drawers.

## 2026-05-31 - [Testing with GSAP & MatchMedia]
**Learning:** Testing components that use GSAP or responsive hooks in JSDOM requires a `window.matchMedia` mock in `src/test/setup.ts`.
**Action:** Ensure `window.matchMedia` is mocked in the test setup for any repository using GSAP animations.
