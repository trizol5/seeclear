let selected = null;
let attempts = 0;
let score = 0;

const lines = [{ name: "Kwun Tong Line", color: "#00AB4E", number: 1 },
{ name: "Tsuen Wan Line", color: "#E2231A", number: 2 },
{ name: "Island Line", color: "#007DC5", number: 3 },
{ name: "Tung Chung Line", color: "#F7943E", number: 4 },
{ name: "South Island Line", color: "#BAC429", number: 5 },
{ name: "Tuen Ma Line", color: "#923011", number: 6 }];

const map = document.getElementById("mtr-map");
for (let i = 0; i < lines.length; i++) {
    let div = document.createElement("div");
    div.classList.add("map");
    div.style.backgroundColor = lines[i].color;
    div.textContent = lines[i].number;
    map.appendChild(div);
}
const slots = document.getElementById("mtr-slots");
for (let i = 0; i < lines.length; i++) {
    let div = document.createElement("div");
    div.textContent = (i + 1) + ':______________';
    div.dataset.number = lines[i].number;
    slots.appendChild(div);
    div.addEventListener("click", function () {
        if (selected === null) {
            return;
        }
        div.dataset.answer = selected.dataset.number;
        div.textContent = (i + 1) + ": " + selected.textContent;
        selected.classList.remove("selected");
        selected = null;
    });
}

const shuffled = lines.slice();
for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}

const choices = document.getElementById("mtr-choices");
for (let i = 0; i < shuffled.length; i++) {
    let button = document.createElement("button");
    button.textContent = shuffled[i].name;
    button.dataset.number = shuffled[i].number;
    choices.appendChild(button);
    button.addEventListener("click", function () {
        if (selected) {
            selected.classList.remove("selected");
        }
        selected = this;
        selected.classList.add("selected");
    });
}

const checkButton = document.getElementById("check-button");
const nextblock = document.getElementById("next-block");
const history = document.getElementById("history");
const result = document.getElementById("result");

checkButton.addEventListener("click", function () {
    let correctCount = 0;
    for (let i = 0; i < slots.children.length; i++) {
        slots.children[i].classList.remove("correct", "wrong");
        const slot = slots.children[i];
        if (slot.dataset.answer === slot.dataset.number) {
            slot.classList.add("correct");
            correctCount++;
        } else {
            slot.classList.add("wrong");
        }
    }
    attempts++;

    history.appendChild(document.createElement("li")).textContent = `Attempt ${attempts}: ${correctCount} correct`;
    if (attempts === 1) {
        score = Math.round((correctCount / slots.children.length) * 100);
        localStorage.setItem("game1", score);
    }

    if (correctCount === slots.children.length) {
        nextblock.hidden = false;
    }

    result.textContent = `You got ${correctCount} out of ${slots.children.length} correct!`;
});
button.addEventListener("click", function () {
    if (selected) {
        selected.classList.remove("selected");
    }
    location.reload();
});