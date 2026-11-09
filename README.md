# SeeClear

A front-end-only website about accessible colour: see how people with colour vision deficiency see, then check and fix your own colours. CS1102 group project, SDG 11 (with SDG 3).

The site is a route of three games: Home → Level 1 "Find the MTR line" (Experience) → background (Learn) → Level 2 "Contrast sliders" and Level 3 "Fix the poster" (Challenge) → results, tips and links (About).

Plain HTML / CSS / JavaScript. No database, no backend, no build step. Hosted on GitHub Pages.

## Run locally

Open the folder in VS Code and start the **Live Server** extension (right-click `index.html` → "Open with Live Server"). Double-clicking an HTML file also works, because scene data is a JS file, not JSON loaded with `fetch`.

## Folder structure

```
seeclear/
├── index.html          Home                      (Programmer B)
├── experience.html     Experience + Game 1       (Programmer B; Game 1: A)
├── learn.html          Learn                     (Programmer B)
├── checker.html        Checker                   (Programmer A)
├── challenge.html      Games 2 and 3             (Programmer B; games: A)
├── about.html          Results + About           (skeleton and results: A, text: Design & Content)
├── css/
│   └── style.css       Shared styles             (Programmer A)
├── js/
│   ├── color.js        Shared colour functions   (Programmer A)
│   ├── filters.js      Colour-blindness filters  (first version: A; split slider: B)
│   ├── game.js         Shared game scores        (Programmer A)
│   ├── checker.js                                (Programmer A)
│   ├── experience.js   Game 1 (A) + scenes (B)
│   ├── learn.js                                  (Programmer B)
│   ├── challenge.js    Games 2 and 3             (Programmer A)
│   └── ending.js       Results on About page     (Programmer A)
├── docs/
│   └── genai-log-programmer-a.md  GenAI usage record, Programmer A
├── data/
│   └── scenes.js       Scenes and game data      (format: A, content: Design & Content)
├── img/                Scene images, copyright-free only
└── tests/
    ├── color.test.html Self-test for color.js: open in a browser (Programmer A)
    └── data.test.html  Format check for data/scenes.js: open after editing it
```

## Team rules

- One owner per file. Only the owner edits it.
- Programmer B uses `color.js` and `style.css` but does not edit them; ask Programmer A for new functions or styles.
- Bugs go to GitHub Issues: which page, steps to reproduce, screenshot.
- Any AI help with code is logged in the project's GenAI usage log (CS1102 requirement).
