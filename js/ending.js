
let total = 0;
let played = 0;
let scoresElement = document.getElementById("scores");
const gradeElement = document.getElementById("grade");
const averageElement = document.getElementById("average");
const remainingElement = document.getElementById("remaining");
const games = [{ key: "game1", name: "Find the MTR line" },
{ key: "game2", name: "Contrast Ratio" },
{ key: "game3", name: "Fix the Poster" }];
for (let i = 0; i < games.length; i++) {
    let score = localStorage.getItem(games[i].key);
    const li = document.createElement("li");
    if (score === null) {
        li.textContent = `${games[i].name}: Not completed`;
    } else {
        score = Number(score);
        total += score;
        played++;
        li.textContent = `${games[i].name}: ${score} / 100`;
    }
    scoresElement.appendChild(li);
}
if (played === 0) {
    averageElement.textContent = "Play the games to see your results.";
} else {
    const average = Math.round(total / played);
    averageElement.textContent = `Average Score: ${average} / 100`;
    if (average >= 90) {
        gradeElement.textContent = "Colour Champion";
    } else if (average >= 70) {
        gradeElement.textContent = "Good Eye";
    } else {
        gradeElement.textContent = "Keep Practising";
    }
    if (played < games.length) {
        const remaining = games.length - played;
        remainingElement.textContent = `You have ${remaining} game(s) left to play.`;
    }
}