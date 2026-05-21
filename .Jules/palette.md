## 2025-05-14 - [Enhanced Search UX & Header A11y]
**Learning:** Keyboard shortcuts like '/' for search significantly improve efficiency but must be carefully guarded to avoid interfering with native OS/browser shortcuts or user typing. Additionally, CSS transitions and `inert` are not enough for screen readers—explicit `aria-hidden` toggling is required for modal-like mobile menus.
**Action:** Always check `document.activeElement` and modifier keys before triggering shortcuts. Ensure `aria-hidden` matches the visual state of off-screen menus.
