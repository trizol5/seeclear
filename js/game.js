/*
  game.js - shared scoring for the three games
  Owner: Programmer A. Used by experience.js, challenge.js and ending.js.

  Scores are saved in sessionStorage, so they last while the browser tab is
  open and are gone when it is closed. Nothing is sent anywhere.
*/

// The route through the site: Game 1 -> background -> Game 2 -> Game 3 -> results
const GAMES = [
  { id: "game1", name: "Find the MTR line", page: "experience.html" },
  { id: "game2", name: "Contrast sliders", page: "challenge.html#level2" },
  { id: "game3", name: "Fix the poster", page: "challenge.html#level3" }
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
