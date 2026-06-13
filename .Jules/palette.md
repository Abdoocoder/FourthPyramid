## 2025-05-14 - Mobile Navigation Accessibility
**Learning:** For mobile navigation overlays, simply using CSS `opacity: 0` or `max-height: 0` is insufficient for accessibility. The element remains in the accessibility tree and focus order.
**Action:** Always pair visibility state with `aria-hidden` and the `inert` attribute to ensure hidden menus are properly excluded from screen readers and keyboard navigation.

## 2025-05-14 - Standard Search Input Pattern
**Learning:** A delightful search experience involves more than just an input field. Keyboard shortcuts, visual hints, and a quick reset mechanism significantly reduce user friction.
**Action:** Implement the standard search pattern: a '/' shortcut (prevented when already in an input), a visual `<kbd>` hint that disappears on focus/input, and a 'Clear' button that returns focus to the input for immediate re-entry.
