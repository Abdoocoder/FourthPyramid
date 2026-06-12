## 2025-05-22 - Improved Search Micro-interactions and Navigation Accessibility

**Learning:** Mobile navigation menus using `inert` still require `aria-hidden` to fully satisfy automated accessibility tests in JSDOM environments, and standard search inputs should always include a keyboard shortcut hint and a clear button that returns focus to the input.

**Action:** Implement `aria-hidden` alongside `inert` for mobile menus. Use the following pattern for search inputs: '/' shortcut, visual hint, and an 'X' button with `type="button"` and focus restoration.
