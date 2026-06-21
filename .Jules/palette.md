## 2025-05-15 - Standard Search Pattern & Mobile A11y

**Learning:** Implementing a standard search pattern (shortcut + clear button) significantly improves catalog navigability. Mobile navigation menus must use both `inert` and `aria-hidden` when closed to ensure they are fully removed from the accessibility tree, especially in JSDOM testing environments which are sensitive to these attributes.

**Action:** Always include a keyboard shortcut (`/`) and a clear button for search inputs. Ensure mobile drawers are explicitly hidden from screen readers using `aria-hidden` in addition to `inert`.
