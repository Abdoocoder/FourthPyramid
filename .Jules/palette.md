## 2025-05-15 - Enhanced Search UX and Accessibility Synchronization

**Learning:** In React 19, combining the `inert` prop with `aria-hidden` is critical for ensuring that hidden mobile menus are correctly removed from both the accessibility tree and automated focus-order assertions. Additionally, standardizing search inputs with localized keyboard shortcuts and clear buttons provides a high-value utility boost with minimal code.

**Action:** Always pair `inert={!isOpen}` with `aria-hidden={!isOpen ? "true" : undefined}` on mobile navigation overlays. Use the standard search pattern (ps-10/pe-12 padding, search icon focus-color sync, and group-focus-within for hints) to maintain design system consistency.
