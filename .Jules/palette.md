# Palette's Journal

## 2025-05-14 - Enhanced Search & Navigation Accessibility
**Learning:** In React 19, while the `inert` attribute is supported, pairing it with `aria-hidden` is still necessary for maximum compatibility with testing environments (like JSDOM/Vitest) and ensuring components are completely removed from the accessibility tree when closed. Additionally, mocking `window.matchMedia` in `src/test/setup.ts` is critical for testing components that use GSAP or Material Design 3 logic.

**Action:** Always verify that hidden interactive panels (like mobile menus) use both `inert` and `aria-hidden`. Ensure global test setup includes common browser API mocks.
