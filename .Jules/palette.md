# Palette's UX Journal

## 2025-05-15 - Standardizing Search UX & Accessible Menus
**Learning:** Standard search inputs benefit greatly from a "/" focus shortcut and a clear button that returns focus. Accessibility for hidden mobile menus requires both 'inert' and 'aria-hidden' to be fully cleared from the accessibility tree in modern React.
**Action:** Always implement the "/" focus shortcut (with modifier key checks) and the 'inert' attribute for any overlay or drawer that should be hidden from keyboard navigation.
