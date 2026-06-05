## 2025-05-14 - Standardizing Search Input UX

**Learning:** Search inputs often lack standard micro-interactions like quick clear and keyboard access. Implementing a consistent pattern (shortcut, visual hint, clear button) across the app improves efficiency and accessibility. Crucially, keyboard shortcuts must guard against `contenteditable` to avoid interfering with rich text editors.

**Action:** Apply the search pattern (group-focus styling, '/' shortcut with modifier guards, 'type="button"' clear button) to all future catalog/admin search interfaces.
