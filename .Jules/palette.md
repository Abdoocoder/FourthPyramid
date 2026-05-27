## 2025-05-15 - [Search Input UX and Mobile Nav A11y]
**Learning:** Standardizing search input behavior (shortcut, hint, clear button) significantly improves power-user efficiency while maintaining discoverability. Additionally, mobile navigation requires explicit `aria-hidden` in addition to `inert` for robust screen reader support across all testing environments.
**Action:** Always implement the '/' focus shortcut with appropriate input-check guards and ensure mobile menus are fully removed from the accessibility tree when closed.
