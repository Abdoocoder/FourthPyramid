## 2025-05-15 - Enhanced Search UX and Mobile Accessibility
**Learning:** Standardized a reusable search input pattern for this design system including a '/' shortcut, visual hint, and clear button. Also identified that mobile navigation panels using 'inert' still benefit from explicit 'aria-hidden' to ensure absolute parity across screen readers and satisfy existing test suites.
**Action:** Apply the standard search pattern (kbd hint, clear btn, focus restoration) to all search inputs. Ensure all modal/drawer components toggle 'aria-hidden' alongside 'inert'.
