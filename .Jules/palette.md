## 2026-06-16 - Enhanced Search Interaction and Navigation A11y

**Learning:** Testing React 19 components with GSAP and Material Design 3 patterns in JSDOM requires a robust `matchMedia` mock in `setup.ts` to prevent "window.matchMedia is not a function" errors. Additionally, mobile navigation menus must explicitly include `aria-hidden` alongside the `inert` attribute to fully satisfy accessibility tree requirements when collapsed.

**Action:** Always verify `window.matchMedia` is mocked in projects using responsive animations. Use the `group-focus-within` pattern to toggle visibility of secondary UI hints (like keyboard shortcuts) during active user interaction.
