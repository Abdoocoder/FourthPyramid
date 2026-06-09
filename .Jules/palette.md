## 2025-05-14 - Mobile Menu Accessibility Pattern
**Learning:** In this application's layout system, using the `inert` attribute on the mobile navigation panel is necessary but insufficient for passing automated accessibility tests; `aria-hidden` must also be explicitly toggled to ensure the hidden menu is fully removed from the accessibility tree.
**Action:** Always pair `inert={!open}` with `aria-hidden={!open}` for expandable navigation components.

## 2025-05-14 - Search Input UX Pattern
**Learning:** A standard search input in this design system includes a '/' focus shortcut with a visual `<kbd>` hint, a 'Clear' button that returns focus to the input, and contextual icon coloring using `group-focus-within:text-secondary` on the wrapper.
**Action:** Apply this pattern to any new global or catalog-style search inputs for a consistent and accessible experience.
