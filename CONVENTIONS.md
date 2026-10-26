# SeeClear code conventions (draft — Programmer A and B to confirm)

## General
- Indent with 2 spaces, no tabs. UTF-8, LF line endings.
- One owner per file (see README). Do not edit someone else's file; open an Issue or message them.
- Comments in English, short, explaining *why* rather than *what*.

## Naming
| Thing | Style | Example |
| --- | --- | --- |
| Files | lowercase, hyphen if needed | `color.js`, `checker.html` |
| JS variables and functions | camelCase | `hexToRgb`, `contrastRatio` |
| JS constants | UPPER_SNAKE_CASE | `AA_NORMAL = 4.5` |
| CSS classes | lowercase-hyphen | `.nav-bar`, `.btn-primary` |
| CSS colour variables | `--color-` prefix | `--color-text`, `--color-bg` |
| HTML ids | camelCase (matches JS) | `id="textColor"` |

## HTML
- Every page: `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="UTF-8">`, viewport meta.
- Same nav bar and footer on all 6 pages; copy them exactly from `index.html`.
- Scripts at the end of `<body>`, in this order: `data/scenes.js` (if needed), `js/color.js`, `js/filters.js` (if needed), then the page's own JS.
- Buttons and inputs get a visible label or `aria-label`.

## CSS
- All colours come from variables in `:root` in `style.css`; no hard-coded colours in page files.
- Layout with Flexbox or Grid; check at 375 px wide (phone).
- Body text about 18 px; site colours must pass WCAG AA.

## JavaScript
- Use `const` by default, `let` when the value changes; never `var`.
- Use `addEventListener` (e.g. `'input'`, `'click'`) instead of inline `oninput=` in HTML.
- Shared functions live only in `color.js`. Need a new one? Ask Programmer A.
- No `fetch` for local data; data lives in `data/scenes.js` as arrays.
- Comment header at the top of each JS file: purpose and owner.

## Git
- Pull before you start, commit small, push often.
- Commit messages: `page/area: what changed`, e.g. `checker: add one-click fix`.
- Bugs and requests go to GitHub Issues: page, steps, screenshot.
- Log any AI help with code in the GenAI usage log.
