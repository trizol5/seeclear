/*
  experience.js - Experience page
  Game 1 "Find the MTR line": first version by Programmer A (2026-11-09).
  Programmer B owns this file and can add the scene explorer below.
  Uses: MTR_GAME (scenes.js), filters.js, game.js.
*/

// ===== Game 1: Find the MTR line =====
const mtrGame = document.getElementById("mtrGame");
const mtrMap = document.getElementById("mtrMap");
const mtrSlots = document.getElementById("mtrSlots");
const chipTray = document.getElementById("chipTray");
const visionSelect = document.getElementById("visionMode");
const checkBtn = document.getElementById("checkBtn");
const resetBtn = document.getElementById("resetBtn");
const gameMessage = document.getElementById("gameMessage");
const nextBlock = document.getElementById("nextBlock");
const attemptList = document.getElementById("attemptList");

const SVG_NS = "http://www.w3.org/2000/svg";
const SNAP_DISTANCE = 32;      // px around a slot that still counts as "on it"
const DRAG_START_DISTANCE = 6; // px the pointer must move before a press becomes a drag

let selectedChip = null;   // chip chosen by clicking, waiting for a slot
let attempts = 0;          // checks in this round
let scoreSaved = false;    // only the first check of a round counts for the score

// ----- Drawing the map -----
function svgElement(name, attributes) {
  const element = document.createElementNS(SVG_NS, name);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}

function drawMap() {
  mtrMap.setAttribute("viewBox", "0 0 " + MTR_GAME.width + " " + MTR_GAME.height);

  // Victoria Harbour, so the map reads as Hong Kong
  mtrMap.appendChild(svgElement("rect", { x: 0, y: 318, width: MTR_GAME.width, height: 34, fill: "#d6e6f2" }));
  const harbour = svgElement("text", { x: 470, y: 340, "font-size": 14, fill: "#3d4b57" });
  harbour.textContent = "Victoria Harbour";
  mtrMap.appendChild(harbour);

  // Lines first, then stations and numbers on top
  for (let i = 0; i < MTR_GAME.lines.length; i++) {
    const line = MTR_GAME.lines[i];
    const points = line.points.map(function (p) { return p.join(","); }).join(" ");
    mtrMap.appendChild(svgElement("polyline", {
      points: points,
      fill: "none",
      stroke: line.color,
      "stroke-width": 9,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }));
  }
  for (let i = 0; i < MTR_GAME.lines.length; i++) {
    const line = MTR_GAME.lines[i];
    for (let j = 1; j < line.points.length; j++) {
      mtrMap.appendChild(svgElement("circle", {
        cx: line.points[j][0], cy: line.points[j][1], r: 6,
        fill: "#ffffff", stroke: "#1f1f1f", "stroke-width": 2
      }));
    }
    // Numbered marker at the start of the line
    const start = line.points[0];
    mtrMap.appendChild(svgElement("circle", {
      cx: start[0], cy: start[1], r: 17,
      fill: "#1f1f1f", stroke: "#ffffff", "stroke-width": 3
    }));
    const number = svgElement("text", {
      x: start[0], y: start[1] + 6, "text-anchor": "middle",
      "font-size": 18, "font-weight": 700, fill: "#ffffff"
    });
    number.textContent = String(i + 1);
    mtrMap.appendChild(number);
  }
}

// ----- Slots and chips -----
function makeSlots() {
  for (let i = 0; i < MTR_GAME.lines.length; i++) {
    const item = document.createElement("li");
    const number = document.createElement("span");
    number.className = "slot-number";
    number.textContent = String(i + 1);
    const slot = document.createElement("div");
    slot.className = "drop-slot";
    slot.dataset.line = MTR_GAME.lines[i].id;
    slot.dataset.number = String(i + 1);
    slot.tabIndex = 0;
    slot.setAttribute("role", "button");
    const mark = document.createElement("span");
    mark.className = "slot-mark";
    item.appendChild(number);
    item.appendChild(slot);
    item.appendChild(mark);
    mtrSlots.appendChild(item);

    slot.addEventListener("click", function (event) {
      if (event.target === slot) {
        slotClicked(slot);
      }
    });
    slot.addEventListener("keydown", function (event) {
      if (event.target === slot && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        slotClicked(slot);
      }
    });
    updateSlotLabel(slot);
  }
}

function makeChip(line) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "line-chip";
  chip.dataset.line = line.id;
  const swatch = document.createElement("span");
  swatch.className = "chip-swatch";
  swatch.style.background = line.color;
  chip.appendChild(swatch);
  chip.appendChild(document.createTextNode(line.name));
  addDragHandlers(chip);
  return chip;
}

// Put the chips in the tray in a random order (Fisher-Yates shuffle)
function fillTray() {
  const order = MTR_GAME.lines.slice();
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = order[i];
    order[i] = order[j];
    order[j] = temp;
  }
  chipTray.innerHTML = "";
  for (let i = 0; i < order.length; i++) {
    chipTray.appendChild(makeChip(order[i]));
  }
}

function chipInSlot(slot) {
  return slot.querySelector(".line-chip");
}

function updateSlotLabel(slot) {
  const chip = chipInSlot(slot);
  slot.setAttribute("aria-label", "Number " + slot.dataset.number + ": " +
    (chip ? chip.textContent : "empty"));
}

function selectChip(chip) {
  if (selectedChip) {
    selectedChip.classList.remove("selected");
    selectedChip.setAttribute("aria-pressed", "false");
  }
  selectedChip = chip;
  if (chip) {
    chip.classList.add("selected");
    chip.setAttribute("aria-pressed", "true");
    gameMessage.textContent = chip.textContent + " selected. Now choose a number.";
  }
}

// Move a chip into a slot. A chip already there swaps places with it
// (or goes back to the tray if the new chip came from the tray).
function placeChip(chip, slot) {
  const oldChip = chipInSlot(slot);
  const oldSlot = chip.parentElement.classList.contains("drop-slot") ? chip.parentElement : null;
  if (oldChip && oldChip !== chip) {
    if (oldSlot) {
      oldSlot.appendChild(oldChip);
    } else {
      chipTray.appendChild(oldChip);
    }
  }
  slot.appendChild(chip);
  if (oldSlot && oldSlot !== slot) {
    updateSlotLabel(oldSlot);
  }
  updateSlotLabel(slot);
  selectChip(null);
  clearMarks();
}

function returnToTray(chip) {
  const oldSlot = chip.parentElement.classList.contains("drop-slot") ? chip.parentElement : null;
  chipTray.appendChild(chip);
  if (oldSlot) {
    updateSlotLabel(oldSlot);
  }
  selectChip(null);
  clearMarks();
}

function slotClicked(slot) {
  if (selectedChip) {
    placeChip(selectedChip, slot);
    gameMessage.textContent = "";
  } else if (chipInSlot(slot)) {
    returnToTray(chipInSlot(slot));
  }
}

// ----- Dragging (mouse, pen and touch), with snapping to the nearest slot -----
function slotNear(x, y) {
  const slots = mtrSlots.querySelectorAll(".drop-slot");
  let best = null;
  let bestDistance = Infinity;
  for (let i = 0; i < slots.length; i++) {
    const box = slots[i].getBoundingClientRect();
    // Distance from the pointer to the slot's box (0 if inside it)
    const dx = Math.max(box.left - x, 0, x - box.right);
    const dy = Math.max(box.top - y, 0, y - box.bottom);
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= SNAP_DISTANCE && distance < bestDistance) {
      best = slots[i];
      bestDistance = distance;
    }
  }
  return best;
}

function addDragHandlers(chip) {
  let startX = 0;
  let startY = 0;
  let pressed = false;
  let dragging = false;
  let justDragged = false;

  chip.addEventListener("pointerdown", function (event) {
    if (event.button !== 0) {
      return;
    }
    pressed = true;
    dragging = false;
    startX = event.clientX;
    startY = event.clientY;
    chip.setPointerCapture(event.pointerId);
  });

  chip.addEventListener("pointermove", function (event) {
    if (!pressed) {
      return;
    }
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!dragging && Math.sqrt(dx * dx + dy * dy) > DRAG_START_DISTANCE) {
      dragging = true;
      chip.classList.add("dragging");
    }
    if (dragging) {
      chip.style.transform = "translate(" + dx + "px, " + dy + "px)";
      const target = slotNear(event.clientX, event.clientY);
      const slots = mtrSlots.querySelectorAll(".drop-slot");
      for (let i = 0; i < slots.length; i++) {
        slots[i].classList.toggle("drop-target", slots[i] === target);
      }
    }
  });

  function endDrag(event, dropped) {
    if (!pressed) {
      return;
    }
    pressed = false;
    if (!dragging) {
      return;
    }
    dragging = false;
    // Ignore the click the browser may send right after a drag
    justDragged = true;
    setTimeout(function () { justDragged = false; }, 0);
    chip.classList.remove("dragging");
    chip.style.transform = "";
    const slots = mtrSlots.querySelectorAll(".drop-slot");
    for (let i = 0; i < slots.length; i++) {
      slots[i].classList.remove("drop-target");
    }
    const target = dropped ? slotNear(event.clientX, event.clientY) : null;
    if (target) {
      placeChip(chip, target);
    } else {
      returnToTray(chip);
    }
  }

  chip.addEventListener("pointerup", function (event) { endDrag(event, true); });
  chip.addEventListener("pointercancel", function (event) { endDrag(event, false); });

  // A click without dragging selects the chip (also works with the keyboard)
  chip.addEventListener("click", function () {
    if (justDragged) {
      return;
    }
    const slot = chip.parentElement.classList.contains("drop-slot") ? chip.parentElement : null;
    if (selectedChip && selectedChip !== chip && slot) {
      // Another name is selected: put it here (the two swap)
      placeChip(selectedChip, slot);
      gameMessage.textContent = "";
    } else {
      selectChip(selectedChip === chip ? null : chip);
    }
  });
}

// ----- Checking -----
function clearMarks() {
  const items = mtrSlots.querySelectorAll("li");
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("correct", "wrong");
    items[i].querySelector(".slot-mark").textContent = "";
  }
}

function checkAnswers() {
  const items = mtrSlots.querySelectorAll("li");
  let correct = 0;
  for (let i = 0; i < items.length; i++) {
    const slot = items[i].querySelector(".drop-slot");
    const chip = chipInSlot(slot);
    const isRight = chip !== null && chip.dataset.line === slot.dataset.line;
    items[i].classList.toggle("correct", isRight);
    items[i].classList.toggle("wrong", !isRight);
    items[i].querySelector(".slot-mark").textContent = isRight ? "✓ Correct" : "✗ Try again";
    if (isRight) {
      correct++;
    }
  }
  const total = items.length;
  attempts++;

  if (!scoreSaved) {
    saveScore("game1", correct / total * 100);
    scoreSaved = true;
  }

  const record = document.createElement("li");
  record.textContent = "Attempt " + attempts + ": " + correct + " of " + total +
    " correct (" + visionModeName(visionSelect.value) + ")";
  attemptList.prepend(record);

  if (correct === total) {
    gameMessage.textContent = "All " + total + " lines are right! Your first try scored " +
      getScore("game1") + "%.";
    nextBlock.hidden = false;
  } else {
    gameMessage.textContent = correct + " of " + total +
      " are right. Lines that look alike are hard to tell apart without colour.";
  }
}

function resetGame() {
  fillTray();
  const slots = mtrSlots.querySelectorAll(".drop-slot");
  for (let i = 0; i < slots.length; i++) {
    updateSlotLabel(slots[i]);
  }
  selectChip(null);
  clearMarks();
  attempts = 0;
  scoreSaved = false;
  attemptList.innerHTML = "";
  gameMessage.textContent = "";
  nextBlock.hidden = true;
}

// ----- Start -----
if (mtrGame && typeof MTR_GAME !== "undefined") {
  drawMap();
  makeSlots();
  fillTray();
  fillVisionSelect(visionSelect, "deuteranopia");
  setVisionMode(mtrGame, visionSelect.value);
  visionSelect.addEventListener("change", function () {
    setVisionMode(mtrGame, visionSelect.value);
  });
  checkBtn.addEventListener("click", checkAnswers);
  resetBtn.addEventListener("click", resetGame);
}
