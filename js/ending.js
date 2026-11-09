/*
  ending.js - results of the three games on the About page
  Owner: Programmer A. Uses game.js.
*/

const resultSteps = document.getElementById("resultSteps");
const resultLevel = document.getElementById("resultLevel");
const resultNote = document.getElementById("resultNote");

function showResults() {
  for (let i = 0; i < GAMES.length; i++) {
    const game = GAMES[i];
    const score = getScore(game.id);
    const item = document.createElement("li");
    item.className = "result-step" + (score === null ? " not-played" : "");

    const number = document.createElement("span");
    number.className = "result-number";
    number.textContent = String(i + 1);

    const name = document.createElement("a");
    name.href = game.page;
    name.textContent = game.name;

    const value = document.createElement("span");
    value.className = "result-score";
    value.textContent = score === null ? "not played" : score + "%";

    item.appendChild(number);
    item.appendChild(name);
    item.appendChild(value);
    resultSteps.appendChild(item);
  }

  const average = averageScore();
  if (average === null) {
    resultLevel.textContent = "-";
    resultNote.textContent = "Play the three games to see your level. Start with Level 1.";
  } else {
    resultLevel.textContent = levelFor(average);
    resultNote.textContent = "Average score: " + Math.round(average) + "%." +
      (getScore("game3") === null || getScore("game1") === null || getScore("game2") === null
        ? " Some games are not played yet."
        : "");
  }
}

if (resultSteps) {
  showResults();
}
