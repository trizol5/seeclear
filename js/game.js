/*
  game.js - shared scoring for the three games
  Owner: Programmer A. Used by experience.js, challenge.js and ending.js.

  Scores are saved in sessionStorage, so they last while the browser tab is
  open and are gone when it is closed. Nothing is sent anywhere.
*/

// The route through the site: Game 1 -> Game 2 -> Game 3 -> results
const GAMES = [
  {
    id: "game1", name: "Find the MTR line", page: "experience.html",
    summary: "Match MTR lines on a map seen through colour-blind eyes."
  },
  {
    id: "game2", name: "Contrast sliders", page: "challenge.html#level2",
    summary: "Slide R, G and B until the text is easy to read."
  },
  {
    id: "game3", name: "Fix the poster", page: "challenge.html#level3",
    summary: "Fix a campus poster with a few colour changes."
  }
];

const SCORE_KEY = "seeclear-scores";

// Read all saved scores: { game1: 80, ... }. Storage can be blocked, so never fail.
function getScores() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SCORE_KEY));
    return saved && typeof saved === "object" ? saved : {};
  } catch (error) {
    return {};
  }
}

// Save one game's score as a whole percentage (0-100)
function saveScore(gameId, percent) {
  const scores = getScores();
  scores[gameId] = Math.max(0, Math.min(100, Math.round(percent)));
  try {
    sessionStorage.setItem(SCORE_KEY, JSON.stringify(scores));
  } catch (error) {
    // Private mode or blocked storage: the game still works, the score just isn't kept
  }
  if (typeof refreshRoute === "function") {
    refreshRoute();
    updatePlayLink();
  }
}

// Score for one game, or null if it hasn't been played yet
function getScore(gameId) {
  const score = getScores()[gameId];
  return typeof score === "number" ? score : null;
}

// Average of the games played so far, or null if none
function averageScore() {
  let total = 0;
  let played = 0;
  for (let i = 0; i < GAMES.length; i++) {
    const score = getScore(GAMES[i].id);
    if (score !== null) {
      total += score;
      played++;
    }
  }
  return played === 0 ? null : total / played;
}

// Average score -> level shown on the results page
function levelFor(average) {
  if (average >= 90) {
    return "A+";
  } else if (average >= 80) {
    return "A";
  } else if (average >= 65) {
    return "B";
  } else if (average >= 50) {
    return "C";
  }
  return "D";
}

// "75" -> "1:15" style timer text
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes + ":" + (rest < 10 ? "0" : "") + rest;
}

// ===== Route bar: Start - 1 - Why - 2 - 3 - Results, then the Checker as a branch =====
// Put <nav class="route" id="routeBar" data-current="game1"> on a page and it is
// filled in here. data-current: "start", "game1", "why", "game2", "game3",
// "results" or "checker". Add data-detail="true" for the large version with a
// summary under each step.
function routeSteps() {
  return [
    { id: "start", name: "Start", page: "index.html", dot: "▶", kind: "end" },
    { id: "game1", name: "Level 1: " + GAMES[0].name, page: GAMES[0].page, dot: "1", kind: "game", summary: GAMES[0].summary },
    { id: "why", name: "Why it matters", page: "why.html", dot: "i", kind: "read", summary: "Who this affects in Hong Kong, and what 4.5:1 means." },
    { id: "game2", name: "Level 2: " + GAMES[1].name, page: GAMES[1].page, dot: "2", kind: "game", summary: GAMES[1].summary },
    { id: "game3", name: "Level 3: " + GAMES[2].name, page: GAMES[2].page, dot: "3", kind: "game", summary: GAMES[2].summary },
    { id: "results", name: "Results", page: "about.html#results", dot: "★", kind: "end", summary: "Your scores, level and tips." },
    { id: "checker", name: "Take it with you: Checker", page: "checker.html", dot: "◎", kind: "tool", summary: "Check your own poster or slides any time." }
  ];
}

function renderRoute(bar) {
  const current = bar.dataset.current;
  const detail = bar.dataset.detail === "true";
  const steps = routeSteps();
  const list = document.createElement("ol");
  list.className = "route-list" + (detail ? " route-detail" : "");

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const score = step.kind === "game" ? getScore(step.id) : null;
    const item = document.createElement("li");
    item.className = "route-step kind-" + step.kind;
    item.dataset.step = step.id;
    if (score !== null) {
      item.classList.add("done");
    }

    const link = document.createElement("a");
    link.href = step.page;
    const dot = document.createElement("span");
    dot.className = "route-dot";
    dot.setAttribute("aria-hidden", "true");
    dot.textContent = step.dot;
    const label = document.createElement("span");
    label.className = "route-label";
    label.textContent = step.name;
    link.appendChild(dot);
    link.appendChild(label);
    if (score !== null) {
      const scoreEl = document.createElement("span");
      scoreEl.className = "route-score";
      scoreEl.textContent = "✓ " + score + "%";
      link.appendChild(scoreEl);
    }
    if (detail && step.summary) {
      const summary = document.createElement("span");
      summary.className = "route-summary";
      summary.textContent = step.summary;
      link.appendChild(summary);
    }
    item.appendChild(link);
    list.appendChild(item);
  }
  bar.innerHTML = "";
  bar.appendChild(list);
  markRouteCurrent(bar, current);
}

// "Play" in the nav bar opens the first level not played yet
function updatePlayLink() {
  const play = document.querySelector('.nav-links a[data-nav="play"]');
  if (!play) {
    return;
  }
  for (let i = 0; i < GAMES.length; i++) {
    if (getScore(GAMES[i].id) === null) {
      play.href = GAMES[i].page;
      return;
    }
  }
  play.href = GAMES[0].page;
}

// Highlight one step as "you are here"
function markRouteCurrent(bar, stepId) {
  const items = bar.querySelectorAll(".route-step");
  for (let i = 0; i < items.length; i++) {
    const isCurrent = items[i].dataset.step === stepId;
    items[i].classList.toggle("current", isCurrent);
    const link = items[i].querySelector("a");
    if (isCurrent) {
      link.setAttribute("aria-current", "step");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

// Redraw the route bar(s), e.g. after a score is saved
function refreshRoute() {
  const bars = document.querySelectorAll(".route");
  for (let i = 0; i < bars.length; i++) {
    const current = bars[i].querySelector(".route-step.current");
    if (current) {
      bars[i].dataset.current = current.dataset.step;
    }
    renderRoute(bars[i]);
  }
}

// On a page with several games (Challenge), follow the one being looked at
function followSections(bar) {
  const sections = document.querySelectorAll("section[data-route-step]");
  if (sections.length < 2 || !("IntersectionObserver" in window)) {
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        markRouteCurrent(bar, entries[i].target.dataset.routeStep);
      }
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  for (let i = 0; i < sections.length; i++) {
    observer.observe(sections[i]);
  }
}

updatePlayLink();
const routeBars = document.querySelectorAll(".route");
for (let i = 0; i < routeBars.length; i++) {
  renderRoute(routeBars[i]);
  followSections(routeBars[i]);
}
