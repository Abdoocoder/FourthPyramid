## 2025-06-06 - Enhanced Search Pattern
**Learning:** A standard search input benefits significantly from a '/' keyboard shortcut and a clear button that returns focus to the input. Combining `group-focus-within` on the container allows the search icon to react to focus states gracefully.
**Action:** Always implement the '/' focus shortcut, clear button, and focus-within styling for search inputs across the app.

## 2025-06-06 - Mobile Nav Accessibility
**Learning:** While `inert` handles focus, `aria-hidden` is still required by some screen readers to correctly remove hidden navigation panels from the accessibility tree.
**Action:** Ensure both `inert` and `aria-hidden` are synced with the open state for all off-canvas or collapsable navigation panels.
