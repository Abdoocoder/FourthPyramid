## 2026-07-02 - [Standardized Search Input Pattern]
**Learning:** Implementing a standardized search input pattern (icon at start, shortcut hint/clear button at end) significantly improves findability and speed for power users while maintaining a clean UI for casual users. The use of 'group-focus-within' on the container allows for synchronized visual feedback between the icon and the input's focus ring.
**Action:** Always include a keyboard shortcut hint (kbd) that hides on focus, and ensure a clear button returns focus to the input to prevent focus loss in the middle of a search task.
