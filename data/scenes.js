/*
  scenes.js - content data for the Experience page and the three games
  Format: Programmer A. Content: Design & Content (the game content below is a
  first version written with the games; replace or extend it as needed).
  Used by: experience.js (scenes, Game 1) and challenge.js (Games 2 and 3).

  This is a plain JS file, not JSON, so pages work when opened with file://
  (browsers block fetch() on local files).

  Rules for whoever fills in the content:
  - Colours are 6-digit hex strings with #, e.g. "#1a73e8".
  - Every id is unique within its list, lowercase-with-hyphens.
  - Positions (x, y, width, height) are percentages of the scene image, 0-100.
  - Images go in img/ and must be copyright-free (own photos/drawings or a free library).
  - Open tests/data.test.html after editing to check the format.
  The EXAMPLE entries below show the format; replace them with real content.
*/

// ===== Experience page: 4 scenes =====
// Each scene is a background image with coloured layers on top.
// Layers are drawn as HTML on top of the image, so users can click one and change its colour.
const SCENES = [
  {
    id: "mtr-sign",                       // unique id
    name: "MTR sign",                     // shown on the scene button
    image: "img/mtr-sign.png",            // background image (no colour-critical parts baked in)
    caption: "EXAMPLE: People with red-green colour blindness find it hard to tell these two lines apart.",
    layers: [
      {
        id: "tsuen-wan-line",
        label: "Tsuen Wan Line",          // name shown when the user selects this layer
        text: "Tsuen Wan Line",           // text drawn on the layer; "" for a plain colour block
        color: "#ffffff",                 // text colour
        background: "#e2231a",            // block colour
        x: 10, y: 20, width: 35, height: 12
      },
      {
        id: "kwun-tong-line",
        label: "Kwun Tong Line",
        text: "Kwun Tong Line",
        color: "#ffffff",
        background: "#00a040",
        x: 55, y: 20, width: 35, height: 12
      }
    ]
  }
  // Add: "bus-stop", "cha-chaan-teng-menu", "course-webpage"
];

// ===== Game 1: "Find the MTR line" (experience.html) =====
// A simplified MTR map (not to scale). Each line has a numbered marker at its
// first point; players drag the line names onto the numbered slots while
// seeing the map through a colour-blindness filter.
// points are [x, y] in map units: x 0-640 (left to right), y 0-420 (top to bottom).
const MTR_GAME = {
  width: 640,
  height: 420,
  lines: [
    {
      id: "tsuen-wan",
      name: "Tsuen Wan Line",
      color: "#e2231a",
      points: [[60, 70], [150, 150], [290, 160], [290, 300], [250, 360]]
    },
    {
      id: "kwun-tong",
      name: "Kwun Tong Line",
      color: "#00a040",
      points: [[600, 250], [520, 180], [410, 120], [302, 150], [302, 300]]
    },
    {
      id: "island",
      name: "Island Line",
      color: "#0075c2",
      points: [[60, 390], [250, 372], [610, 385]]
    },
    {
      id: "tung-chung",
      name: "Tung Chung Line",
      color: "#f7943e",
      points: [[30, 250], [150, 165], [230, 345]]
    },
    {
      id: "east-rail",
      name: "East Rail Line",
      color: "#5eb7e8",
      points: [[430, 25], [400, 120], [380, 290], [320, 365]]
    },
    {
      id: "tuen-ma",
      name: "Tuen Ma Line",
      color: "#923011",
      points: [[40, 160], [180, 70], [410, 105], [560, 50]]
    }
  ]
};

// ===== Game 2: "Contrast sliders" (challenge.html, level 2, 8 questions) =====
// The player moves R, G and B sliders to change the text colour until the
// contrast reaches the target. target is 4.5 (AA), 7 (AAA) or 3 (AA large text).
// Every target must be reachable (tests/data.test.html checks this).
const QUIZ = [
  { id: "q1", text: "Club fair this Friday!", color: "#999999", background: "#ffffff", largeText: false, target: 4.5 },
  { id: "q2", text: "Library closes at 10 pm", color: "#ffffff", background: "#f29e4c", largeText: false, target: 4.5 },
  { id: "q3", text: "EXAM HALL", color: "#e2231a", background: "#00a040", largeText: true, target: 3 },
  { id: "q4", text: "Free coffee at the canteen", color: "#3f5f8a", background: "#1f2a44", largeText: false, target: 4.5 },
  { id: "q5", text: "Lost and found: Level 4", color: "#b0b0b0", background: "#f4f4f4", largeText: false, target: 7 },
  { id: "q6", text: "Bus 11 to Kowloon Tong", color: "#ffd400", background: "#ffffff", largeText: true, target: 3 },
  { id: "q7", text: "Quiet zone, please", color: "#7a1f1f", background: "#3a3a3a", largeText: false, target: 4.5 },
  { id: "q8", text: "Sign up before 30 Nov", color: "#00a040", background: "#e2231a", largeText: false, target: 4.5 }
];

// ===== Game 3: "Fix the poster" (challenge.html, level 3) =====
// The player picks a part of the poster, then a colour from the toolbox.
// Each colour change uses one step; the goal is for every block to pass AA
// before the steps run out. Changing the background counts as a step too.
const FIX_POSTERS = [
  {
    id: "music-night",
    title: "Campus Music Night",
    background: "#f6d743",                // poster background colour
    maxSteps: 6,                          // colour changes allowed
    blocks: [
      { id: "headline", text: "Campus Music Night", color: "#ffffff", largeText: true },
      { id: "date", text: "Friday 28 Nov, 7 pm", color: "#f29e4c", largeText: false },
      { id: "place", text: "Lecture Theatre 1, AC1", color: "#8a8a8a", largeText: false },
      { id: "entry", text: "Free entry, all welcome", color: "#1f1f1f", largeText: false },
      { id: "signup", text: "Sign up at the Student Union desk", color: "#3a7bd5", largeText: false }
    ]
  }
];

// Colours in the Game 3 toolbox
const TOOLBOX = [
  "#ffffff", "#1f1f1f", "#767676", "#f6d743",
  "#f29e4c", "#e2231a", "#7a1f1f", "#00a040",
  "#1b5e20", "#5eb7e8", "#0b3d91", "#4b2c83"
];
