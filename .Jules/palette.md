## 2025-05-15 - Testing JSDOM with GSAP/MD3
**Learning:** Testing components that use GSAP or Material Design 3 in a JSDOM environment requires mocking `window.matchMedia`. Without it, animations or responsive logic tied to media queries will crash the test suite.
**Action:** Always ensure `src/test/setup.ts` includes a robust mock for `matchMedia`.
