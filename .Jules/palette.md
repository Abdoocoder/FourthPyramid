## 2025-05-15 - [Accessible Mobile Menus with Inert]
**Learning:** In React apps with complex animations, merely using `inert` on a hidden mobile menu might not be enough for all testing environments or screen readers if `aria-hidden` is missing. The combination of `aria-hidden` and `inert` ensures the element is both visually and semantically removed from the accessibility tree.
**Action:** Always pair `inert={!isOpen}` with `aria-hidden={!isOpen}` on full-screen overlays or navigation drawers to guarantee full accessibility and pass strict A11y tests.

## 2025-05-15 - [Search Input UX Patterns]
**Learning:** Users expect a quick way to focus search ('/') and a clear way to exit it. A clear button must be a 'button[type="button"]' to avoid accidental form submissions and should return focus to the input for a seamless experience.
**Action:** Implement the "Focus-Shortcut-Clear" pattern for all main search inputs: '/' to focus, a visual kbd hint, and an 'X' button that clears and re-focuses.
