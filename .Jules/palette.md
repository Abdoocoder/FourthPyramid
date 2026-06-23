## 2025-05-14 - Enhanced Search & Navigation Accessibility

**Learning:** In a JSDOM environment, components using GSAP or MD3 (Material Design 3) that check for reduced motion or media queries will crash unless `window.matchMedia` is explicitly mocked with all standard methods (`addListener`, `removeListener`, etc.). Additionally, for mobile navigation panels, using the `inert` attribute alone might not be enough for some test configurations; pairing it with `aria-hidden` ensures the element is correctly removed from the accessibility tree and passes a11y focus tests.

**Action:** Always verify `src/test/setup.ts` contains a robust `matchMedia` mock when working with animations. When implementing collapsible navigation, explicitly toggle both `inert` and `aria-hidden` based on the open state to maintain a clean accessibility tree.
