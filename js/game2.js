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

const question = [
{ text: "City University of Hong Kong", 
                   color: "#d9d9d9", 
                   background: "#e59edd", 
                   target: 3.0 , 
                   fontSize: "34px",},
{ text: "CS 1102\nIntroduction to Computer Studies",
        color: "#cccc00",
        background: "#4e95d9",
        target: 4.5,
        fontSize: "32px",},
{ text: "Focus on the welfare of\nvisually impaired people",
        color: "#c00000",
        background: "#00b050",
        target: 7.0,
        fontSize: "32px",
    },
];
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
    
    let newlySolved = false;
    if (ratioValue >= question[current].target) {
        statusText.textContent = "✔ Pass";
        if (!solved[current]) {
            solved[current] = true;
            newlySolved = true;
        }
    } else {
        statusText.textContent = `✖ Too low, need ${question[current].target}:1 or higher`;
    }
    const solvedCount = solved.filter(v => v).length;
    
    const score = Math.round((solvedCount / question.length) * 100);
    if (newlySolved) {
        localStorage.setItem("game2", score);
    }
    solvedNumber.textContent = `Solved: ${solvedCount} / ${solved.length}`;
    if (solved.every(v => v)) {
        nextBlock.hidden = false;
    }

    
}

function showQuestion() {
    cardtext.textContent = question[current].text;
    cardtext.style.color = question[current].color;
    card.style.backgroundColor = question[current].background;
    card.style.fontSize = question[current].fontSize;
    
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
