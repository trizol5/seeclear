/*
  challenge.js - Challenge page
  Game 2 "Contrast sliders" and Game 3 "Fix the poster": first version by
  Programmer A (2026-11-09).
  Uses: QUIZ, FIX_POSTERS, TOOLBOX (scenes.js), color.js, game.js.
*/

// Ratio (1-21) -> 0-100% along a bar, on a log scale (same as the Checker gauge)
function ratioPercent(ratio) {
  return Math.min(100, Math.log(ratio) / Math.log(21) * 100);
}

// ===== Game 2: Contrast sliders =====
const quizPicture = document.getElementById("quizPicture");
const quizText = document.getElementById("quizText");
const quizRatio = document.getElementById("quizRatio");
const quizTarget = document.getElementById("quizTarget");
const quizLevelFill = document.getElementById("quizLevelFill");
const quizTargetTick = document.getElementById("quizTargetTick");
const quizStatus = document.getElementById("quizStatus");
const quizCount = document.getElementById("quizCount");
const quizSolvedEl = document.getElementById("quizSolved");
const quizPrev = document.getElementById("quizPrev");
const quizNext = document.getElementById("quizNext");
const quizReset = document.getElementById("quizReset");
const sliders = [
  { input: document.getElementById("sliderR"), output: document.getElementById("valueR") },
  { input: document.getElementById("sliderG"), output: document.getElementById("valueG") },
  { input: document.getElementById("sliderB"), output: document.getElementById("valueB") }
];

let quizIndex = 0;
// The player's current text colour for each question, and which are solved
const quizColors = QUIZ.map(function (q) { return q.color; });
const quizSolved = QUIZ.map(function () { return false; });

function solvedCount() {
  return quizSolved.filter(function (solved) { return solved; }).length;
}

// Show question number quizIndex with the player's current colour
function showQuestion() {
  const q = QUIZ[quizIndex];
  const rgb = hexToRgb(quizColors[quizIndex]);
  for (let i = 0; i < 3; i++) {
    sliders[i].input.value = rgb[i];
  }
  quizText.textContent = q.text;
  quizText.classList.toggle("preview-large", q.largeText);
  quizPicture.style.background = q.background;
  quizTarget.textContent = q.target + ":1" + (q.largeText ? " (large text)" : "");
  quizTargetTick.style.left = ratioPercent(q.target) + "%";
  quizCount.textContent = (quizIndex + 1) + " / " + QUIZ.length;
  quizPrev.disabled = quizIndex === 0;
  quizNext.disabled = quizIndex === QUIZ.length - 1;
  updateQuiz();
}

// Read the sliders, recolour the text and update the contrast level
function updateQuiz() {
  const q = QUIZ[quizIndex];
  const color = rgbToHex(
    Number(sliders[0].input.value),
    Number(sliders[1].input.value),
    Number(sliders[2].input.value)
  );
  quizColors[quizIndex] = color;
  for (let i = 0; i < 3; i++) {
    sliders[i].output.textContent = sliders[i].input.value;
  }
  quizText.style.color = color;

  const ratio = contrast(color, q.background);
  const reached = ratio >= q.target;
  quizRatio.textContent = formatRatio(ratio) + ":1";
  quizLevelFill.style.width = ratioPercent(ratio) + "%";
  quizLevelFill.classList.toggle("reached", reached);

  if (reached && !quizSolved[quizIndex]) {
    quizSolved[quizIndex] = true;
    saveScore("game2", solvedCount() / QUIZ.length * 100);
  }
  quizSolvedEl.textContent = solvedCount();
  quizStatus.textContent = reached
    ? "✓ Target reached with " + color + "." + (quizIndex < QUIZ.length - 1 ? " Press Next." : "")
    : "Not yet: the text needs more contrast against this background.";
}

if (document.getElementById("level2") && typeof QUIZ !== "undefined") {
  document.getElementById("quizTotal").textContent = QUIZ.length;
  for (let i = 0; i < 3; i++) {
    sliders[i].input.addEventListener("input", updateQuiz);
  }
  quizPrev.addEventListener("click", function () {
    if (quizIndex > 0) {
      quizIndex--;
      showQuestion();
    }
  });
  quizNext.addEventListener("click", function () {
    if (quizIndex < QUIZ.length - 1) {
      quizIndex++;
      showQuestion();
    }
  });
  quizReset.addEventListener("click", function () {
    quizColors[quizIndex] = QUIZ[quizIndex].color;
    showQuestion();
  });
  showQuestion();
}

// ===== Game 3: Fix the poster =====
const posterEl = document.getElementById("poster");
const toolboxEl = document.getElementById("toolbox");
const selectedPartEl = document.getElementById("selectedPart");
const selectBackgroundBtn = document.getElementById("selectBackground");
const stepsLeftEl = document.getElementById("stepsLeft");
const timerEl = document.getElementById("timer");
const progressPass = document.getElementById("progressPass");
const progressFail = document.getElementById("progressFail");
const progressText = document.getElementById("progressText");
const posterResetBtn = document.getElementById("posterReset");
const level3Done = document.getElementById("level3Done");
const level3Result = document.getElementById("level3Result");

const poster = FIX_POSTERS[0];
let posterBackground = poster.background;
let blockColors = {};      // block id -> current text colour
let selectedPart = null;   // a block id, "background", or null
let stepsLeft = poster.maxSteps;
let seconds = 0;
let timerId = null;
let posterFinished = false;

function blockPasses(block) {
  const ratio = contrast(blockColors[block.id], posterBackground);
  return rating(ratio, block.largeText) !== "Fail";
}

function passingCount() {
  return poster.blocks.filter(blockPasses).length;
}

function startTimer() {
  if (timerId === null && !posterFinished) {
    timerId = setInterval(function () {
      seconds++;
      timerEl.textContent = formatTime(seconds);
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function partName(part) {
  if (part === "background") {
    return "poster background";
  }
  for (let i = 0; i < poster.blocks.length; i++) {
    if (poster.blocks[i].id === part) {
      return "\"" + poster.blocks[i].text + "\"";
    }
  }
  return "nothing yet";
}

function selectPart(part) {
  if (posterFinished) {
    return;
  }
  selectedPart = part;
  selectedPartEl.textContent = "Selected: " + partName(part);
  const blocks = posterEl.querySelectorAll(".poster-block");
  for (let i = 0; i < blocks.length; i++) {
    const isSelected = blocks[i].dataset.block === part;
    blocks[i].classList.toggle("selected", isSelected);
    blocks[i].setAttribute("aria-pressed", String(isSelected));
  }
  selectBackgroundBtn.setAttribute("aria-pressed", String(part === "background"));
  posterEl.classList.toggle("selected", part === "background");
  startTimer();
}

// Draw the poster with the current colours and update the progress bar
function renderPoster() {
  posterEl.innerHTML = "";
  posterEl.style.background = posterBackground;
  for (let i = 0; i < poster.blocks.length; i++) {
    const block = poster.blocks[i];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "poster-block" + (block.largeText ? " preview-large" : "");
    button.dataset.block = block.id;
    button.style.color = blockColors[block.id];
    button.textContent = block.text;
    const passes = blockPasses(block);
    const mark = document.createElement("span");
    mark.className = "block-mark " + (passes ? "pass" : "fail");
    mark.textContent = passes ? "✓ AA" : "✗";
    mark.setAttribute("aria-label", passes ? "passes AA" : "fails AA");
    button.appendChild(mark);
    button.setAttribute("aria-pressed", String(selectedPart === block.id));
    button.classList.toggle("selected", selectedPart === block.id);
    button.addEventListener("click", function () { selectPart(block.id); });
    posterEl.appendChild(button);
  }

  const pass = passingCount();
  const total = poster.blocks.length;
  const percent = Math.round(pass / total * 100);
  progressPass.style.width = percent + "%";
  progressPass.textContent = percent > 0 ? percent + "% pass" : "";
  progressFail.style.width = (100 - percent) + "%";
  progressFail.textContent = percent < 100 ? (100 - percent) + "% fail" : "";
  progressText.textContent = pass + " of " + total + " blocks pass AA.";
  stepsLeftEl.textContent = stepsLeft;
}

function applyColor(color) {
  if (posterFinished) {
    return;
  }
  if (selectedPart === null) {
    selectedPartEl.textContent = "Select a part of the poster first.";
    return;
  }
  if (selectedPart === "background") {
    posterBackground = color;
  } else {
    blockColors[selectedPart] = color;
  }
  stepsLeft--;
  startTimer();
  renderPoster();

  const pass = passingCount();
  if (pass === poster.blocks.length || stepsLeft === 0) {
    finishPoster(pass);
  }
}

function finishPoster(pass) {
  posterFinished = true;
  stopTimer();
  const total = poster.blocks.length;
  const percent = pass / total * 100;
  saveScore("game3", percent);
  const swatches = toolboxEl.querySelectorAll("button");
  for (let i = 0; i < swatches.length; i++) {
    swatches[i].disabled = true;
  }
  selectBackgroundBtn.disabled = true;
  level3Result.textContent = (pass === total
    ? "Poster fixed! Every block passes AA, with " + stepsLeft + " step(s) to spare"
    : "Out of steps: " + pass + " of " + total + " blocks pass AA") +
    ", in " + formatTime(seconds) + ".";
  level3Done.hidden = false;
}

function makeToolbox() {
  for (let i = 0; i < TOOLBOX.length; i++) {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "swatch";
    swatch.style.background = TOOLBOX[i];
    swatch.title = TOOLBOX[i];
    swatch.setAttribute("aria-label", "Colour " + TOOLBOX[i]);
    swatch.addEventListener("click", function () { applyColor(TOOLBOX[i]); });
    toolboxEl.appendChild(swatch);
  }
}

function resetPoster() {
  stopTimer();
  posterBackground = poster.background;
  blockColors = {};
  for (let i = 0; i < poster.blocks.length; i++) {
    blockColors[poster.blocks[i].id] = poster.blocks[i].color;
  }
  stepsLeft = poster.maxSteps;
  seconds = 0;
  timerEl.textContent = formatTime(0);
  posterFinished = false;
  selectedPart = null;
  selectedPartEl.textContent = "Selected: nothing yet";
  selectBackgroundBtn.disabled = false;
  selectBackgroundBtn.setAttribute("aria-pressed", "false");
  posterEl.classList.remove("selected");
  const swatches = toolboxEl.querySelectorAll("button");
  for (let i = 0; i < swatches.length; i++) {
    swatches[i].disabled = false;
  }
  level3Done.hidden = true;
  renderPoster();
}

if (posterEl && typeof FIX_POSTERS !== "undefined") {
  makeToolbox();
  selectBackgroundBtn.addEventListener("click", function () { selectPart("background"); });
  posterResetBtn.addEventListener("click", resetPoster);
  resetPoster();
}
