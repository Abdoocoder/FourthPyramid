## 2025-05-15 - Standard Search Input Pattern
**Learning:** A standard search input enhancement includes a keyboard shortcut ('/') with a visual hint, a clear button, and focus-state visual feedback. Using `group-focus-within` on the container allows the icon to react to input focus.
**Action:** Implement '/' focus shortcut, visual `<kbd>` hint (hidden on focus), and a 'Clear' button (type="button") that returns focus.

## 2025-05-15 - Mobile Menu Accessibility Tree
**Learning:** Simply hiding a mobile menu visually is insufficient. It must be explicitly removed from the accessibility tree and focus order using `aria-hidden` and the `inert` attribute when closed.
**Action:** Apply `aria-hidden={!open}` and `inert={!open ? true : undefined}` to navigation overlays.
