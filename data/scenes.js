/*
  scenes.js - content data for the Experience and Challenge pages
  Format: Programmer A. Content: Design & Content.
  Used by: experience.js and challenge.js (Programmer B).

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

// ===== Challenge mode A: "Pass or fail?" (10 questions) =====
// The correct answer is NOT stored here: the page works it out with color.js,
// so a typo in an answer can never make the game wrong.
const QUIZ = [
  {
    id: "q1",
    text: "Club fair this Friday!",       // sample text shown in the question
    color: "#999999",                     // text colour
    background: "#ffffff",                // background colour
    largeText: false                      // true if shown as large text (24px+ or 18.66px+ bold)
  }
  // Add q2 ... q10. Aim for a mix: about half pass AA, some close calls near 4.5.
];

// ===== Challenge mode B: "Fix the poster" (1-2 posters) =====
// Each poster is a set of text blocks with bad colours. The player changes the
// colours; the page scores how many blocks pass AA and how close the new
// colours stay to the originals.
const FIX_POSTERS = [
  {
    id: "poster-1",
    title: "EXAMPLE: Campus Music Night",
    background: "#f6d743",                // poster background colour
    blocks: [
      {
        id: "headline",
        text: "Campus Music Night",
        color: "#ffffff",
        largeText: true
      },
      {
        id: "details",
        text: "Friday 7pm, Lecture Theatre 1",
        color: "#f29e4c",
        largeText: false
      }
    ]
  }
];
