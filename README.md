# SeeClear

A front-end-only website about accessible colour: see how people with colour vision deficiency see, then check and fix your own colours. CS1102 group project, SDG 11 (with SDG 3).

Plain HTML / CSS / JavaScript. No database, no backend, no build step. Hosted on GitHub Pages.

## Run locally

Open the folder in VS Code and start the **Live Server** extension (right-click `index.html` → "Open with Live Server"). Double-clicking an HTML file also works, because scene data is a JS file, not JSON loaded with `fetch`.

## Folder structure

```
seeclear/
├── index.html          Home                      (Programmer B)
├── experience.html     Experience                (Programmer B)
├── learn.html          Learn                     (Programmer B)
├── checker.html        Checker                   (Programmer A)
├── challenge.html      Challenge                 (Programmer B)
├── about.html          About                     (skeleton: A, text: Design & Content)
├── css/
│   └── style.css       Shared styles             (Programmer A)
├── js/
│   ├── color.js        Shared colour functions   (Programmer A)
│   ├── filters.js      Colour-blindness filters  (Programmer B)
│   ├── checker.js                                (Programmer A)
│   ├── experience.js                             (Programmer B)
│   ├── learn.js                                  (Programmer B)
│   └── challenge.js                              (Programmer B)
├── data/
│   └── scenes.js       Scenes and quiz data      (format: A, content: Design & Content)
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
