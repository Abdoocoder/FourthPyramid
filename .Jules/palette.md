## 2025-05-14 - Standard Search Input Pattern
**Learning:** A high-quality search input should provide multiple accessibility and UX layers: a keyboard shortcut ('/') for power users, a visible hint (<kbd>) for discoverability, a clear button for efficiency, and visual synchronization (icon color matching focus ring).
**Action:** Always implement these four layers together when adding search inputs. Ensure the shortcut logic ignores modifier keys and doesn't trigger when the user is already focused on an editable element.
