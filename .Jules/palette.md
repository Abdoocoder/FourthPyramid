## 2026-06-04 - Search Micro-UX and Mobile A11y
**Learning:** Adding a keyboard shortcut hint (<kbd>) and a clear button to search inputs significantly improves discoverability and speed. For mobile navigation, `inert` alone may not be enough for all screen readers; pairing it with `aria-hidden` ensures consistent behavior across the accessibility tree.
**Action:** Always implement the '/' shortcut and 'X' clear button for search interfaces. Ensure all hidden interactive panels use both `aria-hidden` and `inert`.
