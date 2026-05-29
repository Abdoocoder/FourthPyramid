## 2025-05-15 - Search Input Accessibility & UX Pattern
**Learning:** A complete search micro-UX includes keyboard accessibility ('/'), a clearable state (X button), and visual focus feedback.
**Action:** Always implement the '/' focus shortcut with a '<kbd>' hint and ensure focus returns to the input after clearing.

## 2025-05-15 - Vitest JSDOM Environment Fix
**Learning:** GSAP and MD3 components often rely on 'window.matchMedia' which is not available in JSDOM by default.
**Action:** Add a 'window.matchMedia' mock in 'src/test/setup.ts' to prevent 'TypeError: window.matchMedia is not a function' in tests.
