## 2025-05-15 - Standardizing Search Experience & Mobile Menu A11y

**Learning:**
1. Keyboard shortcuts like `/` for search are powerful but require careful implementation to avoid interfering with native browser shortcuts or typing in other inputs.
2. The `inert` attribute is essential for removing hidden elements from the accessibility tree, but must be paired with `aria-hidden` for consistent screen reader behavior across all environments.
3. Vitest/JSDOM environments often lack `window.matchMedia`, which is required by animation libraries like GSAP and responsive logic; a global mock in `setup.ts` is necessary.

**Action:** Always implement shortcuts using checks for `isContentEditable` and modifier keys. Use `inert` and `aria-hidden` together on off-screen navigation menus. Include `matchMedia` mock in project test setup if it's missing.
