## 2025-05-14 - [Enhanced Search & Navigation A11y]
**Learning:** Combining keyboard shortcuts with visual hints (like <kbd>/) and clear buttons significantly improves search discoverability and speed. Also, ensuring mobile menus use both `aria-hidden` and `inert` is critical for modern a11y compliance in React 19 apps.
**Action:** Always implement the "slash to search" pattern in lists/catalogs. Verify mobile nav state management includes explicit aria-hidden toggles.
