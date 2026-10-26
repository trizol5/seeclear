# GenAI Usage Log — Programmer A (Weeks 1–2)

Record of AI help with Programmer A's code in SeeClear (CS1102 group project), kept for the report's "Declaration of GenAI use" and handed to the Research & Delivery role in week 5.

- **Member:** Programmer A (Robin Orson)
- **Period:** Week 1–2 tasks, done on 2026-10-26
- **Tool / model:** Claude (Anthropic) via Claude Code, model Claude Opus 5.5
- **Conversation record:** claude.ai project "SeeClear", thread "梳理 SeeClear 项目思路与分工" — export or screenshot before submission and attach to the report appendix
- **How AI was used:** Programmer A asked for each step in turn; the AI wrote the code, tested it in a browser, and pushed it. Programmer A reviews each entry and fills in the last two columns.

| # | Date | File(s) | Prompt (summary) | AI output | What we changed / kept | Reviewed by |
| --- | --- | --- | --- | --- | --- | --- |
| Programming (HTML / CSS / JS) | Yes | Programming table, P1– |
| Planning / documentation | Yes | Entries 1–2 |
| P1 | 2026-10-26 | Folders `css/ js/ data/ img/`, `README.md`, `.gitignore` | Programmer A (Robin): "一步步推进，从新建项目文件夹开始" (go step by step, start by creating the project folder) | Created the folder structure from the plan document, a README listing files and owners, and a basic `.gitignore` | (to fill) | (to fill) |
| P2 | 2026-10-26 | `CONVENTIONS.md` | (Continuation of P1, while waiting for GitHub access) Draft the code conventions planned for week 1 | A draft of naming, indentation, HTML / CSS / JS rules and Git commit rules | (to fill: what A and B changed when confirming) | (to fill) |
| P3 | 2026-10-26 | `index.html`, `experience.html`, `learn.html`, `checker.html`, `challenge.html`, `about.html` | Programmer A (Robin): "ok" to step 3 — build the 6 page skeletons with shared nav bar and footer | Six HTML skeletons (generated from one template so nav and footer match), each with placeholder sections, element ids and script order per CONVENTIONS.md; pushed to GitHub (commit f7d6d33) and written to the local folder | (to fill) | (to fill) |
| P4 | 2026-10-26 | `css/style.css`, `js/color.js`, `data/scenes.js`, `tests/color.test.html`, `tests/data.test.html`, `README.md` | Programmer A (Robin), batch of three steps: "可以先做一版" (make a first neutral style.css), "继续" (write color.js), "继续" (define the scenes.js and quiz data format). Robin asked to stay within Programmer A's role. | Neutral AA-compliant shared stylesheet (colour variables, nav, buttons, forms, phone layout); color.js with hexToRgb, rgbToHex, luminance, contrast, rating plus normalizeHex and formatRatio, and a 23-case browser self-test; scenes.js format (SCENES, QUIZ, FIX_POSTERS) with one example each and a format-check page for the content team. Pushed to GitHub (commits 8d1e06b, 63a009f, e08a720) and written to the local folder. | (to fill) | (to fill) |
| P5 | 2026-10-26 | `checker.html`, `js/checker.js`, `css/style.css` (checker section + `.sr-only`) | Programmer A (Robin), batch of three "继续" (continue) steps for the week-2 Checker: live update, contrast gauge, one-click fix | Live update of contrast ratio, four AA/AAA badges and preview from colour pickers or typed hex codes (with validation and a swap button); a log-scale contrast gauge (1-21) with ticks at 3 / 4.5 / 7 and a CSS transition; a one-click fix that uses a while loop to move the text colour 1% at a time towards black or white until it reaches the chosen target (4.5 / 7 / 3), keeps the direction needing fewer steps, and explains when no colour can reach the target. Tested in a headless browser. Pushed to GitHub (commits 191c53c, 984444f, 424130d) and written to the local folder. | (to fill) | (to fill) |

## Task mapping (task-division spreadsheet → entry)

| Task | Week | Entry |
| --- | --- | --- |
| Agree code conventions with Programmer B | 1 | P2 |
| Create GitHub repo, 6 page skeletons, nav bar and footer | 1 | P1, P3 |
| Shared style.css | 1 | P4 |
| color.js: colour conversion, contrast, AA / AAA | 1 | P4 |
| scenes.js and quiz data format | 1 | P4 |
| Checker: live update, contrast gauge, one-click fix | 2 | P5 |
