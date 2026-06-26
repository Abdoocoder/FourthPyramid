## 2026-06-26 - [Standard Search Pattern & React 19 A11y]
**Learning:** React 19's `inert` attribute works seamlessly with boolean props, but for robust accessibility tree exclusion in automated tests (like Vitest/JSDOM), it should be paired with `aria-hidden`. Additionally, search inputs with both an icon and a shortcut hint require precise 'ps' and 'pe' padding to avoid text overlap.
**Action:** Always pair `inert={!isOpen}` with `aria-hidden={!isOpen ? "true" : undefined}` on mobile menus. Use localized keys for keyboard shortcuts in `<kbd>` hints to maintain i18n consistency.
