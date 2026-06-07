## 2025-05-15 - Enhanced Search Interactivity & Mobile a11y

**Learning:** Combining keyboard shortcuts with visual hints improves discoverability of efficient navigation patterns. For mobile menus, the `inert` attribute is powerful but needs `aria-hidden` pairing for complete screen reader coverage in some environments.

**Action:** Always pair `inert` with `aria-hidden` for modal-like surfaces. Implement '/' shortcuts in search-heavy interfaces with clear visual `<kbd>` indicators.
