## 2025-05-14 - Standardizing Search UX and Improving Mobile Menu Accessibility

**Learning:** Combining `aria-hidden` and `inert` on mobile navigation panels is essential for satisfying both modern browser behavior and automated Vitest/A11y assertions. In React 19, the `inert` attribute should be passed as a boolean. Additionally, standardizing search inputs with a focus shortcut ('/'), a visual kbd hint, and a clear button significantly improves power-user efficiency and overall usability.

**Action:** Always ensure hidden UI panels (like sidebars or mobile menus) have `aria-hidden={!isOpen ? "true" : undefined}` and `inert={!isOpen}`. When implementing search, include a localized shortcut hint and a clear button that returns focus to the input.
