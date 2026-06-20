## 2025-05-15 - Enhanced Search Interaction Pattern
**Learning:** When implementing a standard search input with both an icon and a shortcut hint, using `ps-12` (or similar large start padding) and `group-focus-within:opacity-0` on the hint element prevents visual overlap with search text while maintaining accessibility.
**Action:** Use 'group' and 'group-focus-within' for coordinated search bar state changes (icon color, hint visibility) without needing local React state for focus.

## 2025-05-15 - Mocking matchMedia for Vitest
**Learning:** Testing with Vitest in the JSDOM environment requires a mock for `window.matchMedia` to support components using GSAP or other media-query-dependent animations.
**Action:** Include a `matchMedia` mock in `src/test/setup.ts` to ensure consistent test passes in the CI environment.
