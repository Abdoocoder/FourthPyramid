## 2025-05-15 - Standardizing search input micro-UX
**Learning:** Adding a keyboard shortcut hint (kbd) and a clear button to search inputs significantly improves discoverability and speed for power users while maintaining simplicity for casual users. In bilingual apps, ensure 'clear' labels are localized and buttons are 'type="button"'.
**Action:** Always implement '/' focus shortcut, visual kbd hint, and an 'X' clear button that returns focus for any primary search input.

## 2025-05-15 - Mobile menu accessibility and testing
**Learning:** Mobile menus that are visually hidden via CSS transforms/opacity are still present in the accessibility tree and focus order. Using 'inert' and 'aria-hidden' synchronized with the open state is critical for WCAG compliance. JSDOM tests for GSAP/MD3 components often require a 'window.matchMedia' mock.
**Action:** Use 'inert={!open}' and 'aria-hidden={!open}' on off-canvas menus. Ensure 'src/test/setup.ts' includes a robust matchMedia mock.
