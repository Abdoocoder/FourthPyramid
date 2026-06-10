## 2025-05-14 - Standardizing Search Interactions
**Learning:** Combining the '/' keyboard shortcut with a visual `<kbd>` hint and a functional clear button significantly reduces interaction friction in product catalogs. Ensuring the clear button returns focus to the input maintains the user's flow.
**Action:** Always implement the "shortcut + kbd hint + clear button" trio for search inputs in this design system.

## 2025-05-14 - Mobile Navigation Accessibility
**Learning:** The `inert` attribute is powerful for removing elements from the focus order, but Vitest/Testing Library checks often still expect `aria-hidden="true"` to consider a menu fully hidden from the accessibility tree.
**Action:** Use both `inert` and `aria-hidden` on mobile navigation panels to satisfy both real-world screen readers and automated a11y tests.
