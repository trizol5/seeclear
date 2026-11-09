/*
  filters.js - colour vision deficiency (CVD) simulation
  First version written for Game 1 (MTR map). Programmer B can build the
  split slider and the scene explorer on top of these functions.

  How it works: one hidden <svg> holds an feColorMatrix filter per vision mode.
  Any element can then be shown "through" a mode with CSS: filter: url(#cvd-...).
  The matrices are from Machado, Oliveira & Fernandes (2009), severity 1.0.
  SVG filters work in linear RGB by default, which is what these matrices expect.
*/

const VISION_MODES = [
  { id: "normal", name: "Normal vision", matrix: null },
  {
    id: "protanopia",
    name: "Protanopia (no red cones)",
    matrix: [
      0.152286, 1.052583, -0.204868,
      0.114503, 0.786281, 0.099216,
      -0.003882, -0.048116, 1.051998
    ]
  },
  {
    id: "deuteranopia",
    name: "Deuteranopia (no green cones)",
    matrix: [
      0.367322, 0.860646, -0.227968,
      0.280085, 0.672501, 0.047413,
      -0.011820, 0.042940, 0.968881
    ]
  },
  {
    id: "tritanopia",
    name: "Tritanopia (no blue cones)",
    matrix: [
      1.255528, -0.076749, -0.178779,
      -0.078411, 0.930809, 0.147602,
      0.004733, 0.691367, 0.303900
    ]
  },
  {
    id: "achromatopsia",
    name: "Achromatopsia (no colour)",
    matrix: [
      0.2126, 0.7152, 0.0722,
      0.2126, 0.7152, 0.0722,
      0.2126, 0.7152, 0.0722
    ]
  }
];

// Turn a 3x3 RGB matrix into the 4x5 list feColorMatrix needs
function matrixValues(m) {
  return [
    m[0], m[1], m[2], 0, 0,
    m[3], m[4], m[5], 0, 0,
    m[6], m[7], m[8], 0, 0,
    0, 0, 0, 1, 0
  ].join(" ");
}

// Add the hidden <svg> with all filters to the page (only once)
function addVisionFilters() {
  if (document.getElementById("cvdFilters")) {
    return;
  }
  const svgNs = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNs, "svg");
  svg.id = "cvdFilters";
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  for (let i = 0; i < VISION_MODES.length; i++) {
    const mode = VISION_MODES[i];
    if (mode.matrix === null) {
      continue;
    }
    const filter = document.createElementNS(svgNs, "filter");
    filter.id = "cvd-" + mode.id;
    const colorMatrix = document.createElementNS(svgNs, "feColorMatrix");
    colorMatrix.setAttribute("type", "matrix");
    colorMatrix.setAttribute("values", matrixValues(mode.matrix));
    filter.appendChild(colorMatrix);
    svg.appendChild(filter);
  }
  document.body.appendChild(svg);
}

// Show an element through a vision mode ("normal" removes the filter)
function setVisionMode(element, modeId) {
  addVisionFilters();
  element.style.filter = modeId === "normal" ? "" : "url(#cvd-" + modeId + ")";
}

// Fill a <select> with the vision modes
function fillVisionSelect(select, selectedId) {
  for (let i = 0; i < VISION_MODES.length; i++) {
    const option = document.createElement("option");
    option.value = VISION_MODES[i].id;
    option.textContent = VISION_MODES[i].name;
    option.selected = VISION_MODES[i].id === selectedId;
    select.appendChild(option);
  }
}

function visionModeName(modeId) {
  for (let i = 0; i < VISION_MODES.length; i++) {
    if (VISION_MODES[i].id === modeId) {
      return VISION_MODES[i].name;
    }
  }
  return modeId;
}
