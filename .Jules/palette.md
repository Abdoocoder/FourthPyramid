## 2025-05-15 - Standard Search Shortcut Pattern
**Learning:** Implementing a '/' shortcut for search focus is a powerful micro-UX improvement, but requires careful implementation: (1) exclude focus if user is already in an input/editable, (2) respect modifier keys, (3) provide a localized visual hint that disappears on focus to avoid clutter.
**Action:** Use a reusable `useEffect` listener for shortcuts and Tailwind `group-focus-within` for coordinating hint visibility and icon colors.

## 2025-05-15 - Mobile Navigation Accessibility
**Learning:** In a bilingual SPA with complex entrance animations, mobile navigation panels often remain in the accessibility tree even when visually hidden (max-height: 0).
**Action:** Always pair `aria-hidden` and `inert` attributes with the open state of mobile menus to ensure they are correctly ignored by screen readers and removed from the focus order when closed.
