console.log("game3.js loaded");
const posterBackground = "#1f3a5f";
const lines = [
{ text: "Good health and well-being", color: "#15557a", large: true },
{ text: "People who are visually impaired deserve the same opportunities, dignity, and safety as everyone else.", 
  color: "#53359b", large: false },
{text:"Everyday barriers like inaccessible websites and blocked sidewalks still limit their lives.",
 color:"#087465", large: false },
{text:"Small acts of awareness can build a fairer world for them.",
 color:"#76505e", large: false },
{text:"Actions begin with provide text that is easy to read.",
 color:"#5e6573", large: false },
               ];
const palette = ["#ffd54f", "#90caf9", "#ff9800", "#e57373", "#f06292", "#4caf50", "#9e9e9e"];
let selected = null;
let stepsleft = 8;
const paletteElement = document.getElementById("palette");
const poster = document.getElementById("poster");
const stepsLeftElement = document.getElementById("steps");
const result = document.getElementById("result");
const progress = document.getElementById("progress");
const nextBlock = document.getElementById("next-block");
const retryBlock = document.getElementById("retry");
poster.style.backgroundColor = posterBackground;
for (let i = 0; i < lines.length; i++) {
    const p = document.createElement("p");
    p.textContent = lines[i].text;
    if (lines[i].large) {
        p.style.fontSize = "34px";
    }
    if (lines[i].color) {
        p.style.color = lines[i].color;
    }
    p.dataset.index = i;
    p.addEventListener("click", function () {
        if (selected) {
            selected.classList.remove("selected");
        }
        selected = this;
        selected.classList.add("selected");
    });

    poster.appendChild(p);
}
for (let i = 0; i < palette.length; i++) {
    const button = document.createElement("button");
    button.style.backgroundColor = palette[i];
    button.dataset.color = palette[i];
    button.classList.add("button");
    button.setAttribute("aria-label", `Color ${palette[i]}`);
    button.title = `Color ${palette[i]}`;
    paletteElement.appendChild(button);
    button.addEventListener("click", function () {
        if (selected) {
            result.textContent = "";
            if (stepsleft <= 0) {
                result.textContent = "No steps left.";
                return;
            }
            selected.style.color = this.dataset.color;
            lines[selected.dataset.index].color = this.dataset.color;
            stepsleft--;
            showSteps();
            update();
        } else {
            result.textContent = "Please select a text line first.";
            return;
        }
    });
}
function showSteps() {
    stepsLeftElement.textContent = `Steps left: ${stepsleft}`;
}
function disablePalette() {
    for (let i = 0; i < palette.length; i++) {
        const button = paletteElement.children[i];
        button.disabled = true;
    }
}
function update() {
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
        const p = poster.children[i];
        p.textContent = lines[i].text;
        const ratioValue = Math.floor(contrast(lines[i].color, posterBackground) * 100) / 100;
        const targetRatio = lines[i].large ? 3 : 4.5;
        if (ratioValue >= targetRatio) {
            const span = document.createElement("span");
            span.textContent = `(Contrast: ${ratioValue}:1)✔`;
            span.style.color = "#ffffff";
            p.appendChild(span);
            count++;
        } else {
            const span = document.createElement("span");
            span.style.color = "#ffffff";
            span.textContent = `(Contrast: ${ratioValue}:1)✖`;
            p.appendChild(span);
        }
    }
    progress.textContent = `Contrast check: ${count} / ${lines.length}`;
    if (count === lines.length) {
        result.textContent = "All lines passed the contrast check!";
        nextBlock.hidden = false;
        disablePalette();
        const score = Math.round((count / lines.length) * 100);
        localStorage.setItem("game3", score);
    } else {
        result.textContent = "";
    }
    if (stepsleft <= 0 && count < lines.length) {
        result.textContent = "No steps left. You did not pass the contrast check.";
        disablePalette();
        retryBlock.hidden = false;
        const score = Math.round((count / lines.length) * 100);
        localStorage.setItem("game3", score);
    }

}
showSteps();
update();
