console.log("game2.js loaded");
let labelr = document.getElementById("red");
let labelg = document.getElementById("green");
let labelb = document.getElementById("blue");
let cardtext = document.getElementById("card-text");
let card = document.getElementById("card");
let ratio = document.getElementById("ratio");
let statusText = document.getElementById("status");
let prevButton = document.getElementById("prev");
let nextButton = document.getElementById("next");
let nextBlock = document.getElementById("next-block");
let questionNumber = document.getElementById("question-number");
let solvedNumber = document.getElementById("solved-number");
let current = 0;

const question = [{ text: "Large Heading text", color: "#b45959", background: "#ca3ba6", target: 3.0 },
{ text: "Normal text", color: "#7f8cb8", background: "#ffffff", target: 4.5 },
{ text: "Small text", color: "#b1af48", background: "#ffffff", target: 7.0 },];
let solved = new Array(question.length).fill(false);
function update() {
    const r = Number(document.getElementById("red").value);
    const g = Number(document.getElementById("green").value);
    const b = Number(document.getElementById("blue").value);
    let rgb = [r, g, b];
    let hex = rgbToHex(rgb);
    cardtext.style.color = hex;
    card.style.backgroundColor = question[current].background;
    const ratioValue = Math.floor(contrast(hex, question[current].background) * 100) / 100;
    ratio.textContent = `Contrast Ratio: ${ratioValue}:1`;
    questionNumber.textContent = `Question ${current + 1} / ${question.length}`;
    

    if (ratioValue >= question[current].target) {
        statusText.textContent = "✔ Pass";
        solved[current] = true;
    } else {
        statusText.textContent = `✖ Too low, need ${question[current].target}:1 or higher`;
    }
    const solvedCount = solved.filter(v => v).length;
    const score = Math.round((solvedCount / question.length) * 100);
    solvedNumber.textContent = `Solved: ${solvedCount} / ${solved.length}`;
    if (solved.every(v => v)) {
        nextBlock.hidden = false;
    }
    localStorage.setItem("game2", score);
}

function showQuestion() {
    cardtext.textContent = question[current].text;
    cardtext.style.color = question[current].color;
    card.style.backgroundColor = question[current].background;
    const rgb = hexToRgb(question[current].color);
    labelr.value = rgb[0];
    labelg.value = rgb[1];
    labelb.value = rgb[2];
    if (current === 0) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }
    if (current === question.length - 1) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }

    update();
}
prevButton.addEventListener("click", function () {
    if (current > 0) {
        current--;
        showQuestion();
    }
});
nextButton.addEventListener("click", function () {
    if (current < question.length - 1) {
        current++;
        showQuestion();
    }
});

labelr.addEventListener("input", update);
labelg.addEventListener("input", update);
labelb.addEventListener("input", update);

showQuestion();