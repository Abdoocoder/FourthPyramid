## 2025-05-14 - [Localized Keyboard Shortcuts]
**Learning:** When implementing keyboard shortcuts (like '/' for search) in a bilingual app, the shortcut key must be localized to match the UI hint, otherwise international users will be confused when the hinted key doesn't work.
**Action:** Always fetch the shortcut key from i18n translations and use it in the event listener, rather than hardcoding the key.

## 2025-05-14 - [Animation Test Support]
**Learning:** GSAP and other animation libraries often rely on `window.matchMedia` even in headless test environments. A missing or incomplete mock can cause cryptic `TypeError: window.matchMedia is not a function` errors.
**Action:** Include a robust `matchMedia` mock in `src/test/setup.ts` that implements both modern (`addEventListener`) and legacy (`addListener`) methods to satisfy different library versions.

## 2025-05-15 - [Gallery Thumbnail Selection & Focus A11y]
**Learning:** In product image galleries with thumbnail buttons, visual active indicators (like borders/rings) are invisible to screen readers and keyboard users tabbing through thumbnails if `aria-current` and `focus-visible:ring-*` styles are omitted.
**Action:** Always set `aria-current={i === activeIndex ? "true" : undefined}` and include explicit focus-visible ring styles on image gallery thumbnail buttons.
