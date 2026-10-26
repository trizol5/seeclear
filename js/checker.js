/*
  checker.js - Contrast Checker page
  Owner: Programmer A. Uses color.js (hexToRgb, normalizeHex, contrast, formatRatio, rating).
*/

// ===== Page elements =====
const textPicker = document.getElementById("textColor");
const textHex = document.getElementById("textColorHex");
const textError = document.getElementById("textColorError");
const bgPicker = document.getElementById("bgColor");
const bgHex = document.getElementById("bgColorHex");
const bgError = document.getElementById("bgColorError");
const swapBtn = document.getElementById("swapBtn");
const ratioEl = document.getElementById("ratio");
const summaryEl = document.getElementById("resultSummary");
const preview = document.getElementById("preview");
const previewBtn = document.getElementById("previewBtn");
const gauge = document.getElementById("gauge");
const gaugeFill = document.getElementById("gaugeFill");

// Each badge: which element shows it, which text size and which level it checks
const BADGES = [
  { id: "badgeNormalAA", largeText: false, level: "AA" },
  { id: "badgeNormalAAA", largeText: false, level: "AAA" },
  { id: "badgeLargeAA", largeText: true, level: "AA" },
  { id: "badgeLargeAAA", largeText: true, level: "AAA" }
];

// The two colours currently being checked, always valid "#rrggbb"
let textColor = normalizeHex(textPicker.value);
let bgColor = normalizeHex(bgPicker.value);

// ===== Contrast gauge =====
// Ratio (1-21) -> position along the gauge (0-100%), on a log scale:
// 1 sits at 0%, 21 at 100%, and the pass lines 3 / 4.5 / 7 sit near the middle
function gaugePercent(ratio) {
  return Math.log(ratio) / Math.log(21) * 100;
}

// Put each threshold tick at its place on the gauge
function placeTicks() {
  const ticks = document.querySelectorAll(".gauge-tick");
  for (let i = 0; i < ticks.length; i++) {
    const ratio = Number(ticks[i].dataset.ratio);
    ticks[i].style.left = gaugePercent(ratio) + "%";
  }
}

function updateGauge(ratio) {
  // The CSS transition on width makes the bar slide to its new length
  gaugeFill.style.width = gaugePercent(ratio) + "%";
  gaugeFill.className = "gauge-fill level-" + rating(ratio, false).toLowerCase();
  gauge.setAttribute("aria-valuenow", formatRatio(ratio));
  gauge.setAttribute("aria-valuetext", formatRatio(ratio) + " to 1");
}

// ===== Update the result whenever a colour changes =====
function updateResult() {
  const ratio = contrast(textColor, bgColor);
  ratioEl.textContent = formatRatio(ratio) + " : 1";
  updateGauge(ratio);

  for (let i = 0; i < BADGES.length; i++) {
    const badge = BADGES[i];
    const result = rating(ratio, badge.largeText);
    // "AAA" also meets "AA", so the AA badge passes for both
    const passed = result === "AAA" || result === badge.level;
    const el = document.getElementById(badge.id);
    el.classList.toggle("pass", passed);
    el.classList.toggle("fail", !passed);
    el.querySelector(".badge-result").textContent = passed ? "✓ Pass" : "✗ Fail";
  }

  preview.style.color = textColor;
  preview.style.backgroundColor = bgColor;
  previewBtn.style.color = bgColor;
  previewBtn.style.backgroundColor = textColor;
  previewBtn.style.borderColor = textColor;

  summaryEl.textContent = "Contrast " + formatRatio(ratio) + " to 1. Normal text: " +
    rating(ratio, false) + ". Large text: " + rating(ratio, true) + ".";
}

// ===== Keep each colour picker and its hex box in sync =====
function connectColorInputs(picker, hexBox, errorEl, setColor) {
  // Colour picker moved: copy the value into the hex box
  picker.addEventListener("input", function () {
    hexBox.value = picker.value;
    errorEl.hidden = true;
    hexBox.removeAttribute("aria-invalid");
    setColor(picker.value);
  });

  // Hex box typed in: update only when the code is valid
  hexBox.addEventListener("input", function () {
    const clean = normalizeHex(hexBox.value);
    if (clean === null) {
      errorEl.hidden = false;
      hexBox.setAttribute("aria-invalid", "true");
      return;
    }
    errorEl.hidden = true;
    hexBox.removeAttribute("aria-invalid");
    picker.value = clean;
    setColor(clean);
  });

  // Leaving the hex box: tidy it to the full "#rrggbb" form
  hexBox.addEventListener("blur", function () {
    hexBox.value = picker.value;
    errorEl.hidden = true;
    hexBox.removeAttribute("aria-invalid");
  });
}

// Set both colours at once and refresh every input and the result
function setColors(newText, newBg) {
  textColor = newText;
  bgColor = newBg;
  textPicker.value = newText;
  textHex.value = newText;
  bgPicker.value = newBg;
  bgHex.value = newBg;
  updateResult();
}

connectColorInputs(textPicker, textHex, textError, function (color) {
  textColor = color;
  updateResult();
});

connectColorInputs(bgPicker, bgHex, bgError, function (color) {
  bgColor = color;
  updateResult();
});

placeTicks();

swapBtn.addEventListener("click", function () {
  setColors(bgColor, textColor);
});

updateResult();
