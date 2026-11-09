/*
  why.js - "Why it matters" page
  Owner: Programmer A (charts and contrast examples). Numbers: Design & Content,
  in BACKGROUND_STATS (data/scenes.js). Uses color.js.
*/

const SVG_NS_WHY = "http://www.w3.org/2000/svg";
// Colours for chart parts. Each part also has a text label, so colour is never the only clue.
const CHART_COLORS = ["#0b57b0", "#5eb7e8", "#1b6e2a", "#f29e4c", "#7a1f1f", "#767676"];

function svgNode(name, attributes, text) {
  const node = document.createElementNS(SVG_NS_WHY, name);
  for (const key in attributes) {
    node.setAttribute(key, attributes[key]);
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

function showEmpty(area, message) {
  area.innerHTML = "";
  const box = document.createElement("div");
  box.className = "chart-empty";
  box.textContent = message;
  area.appendChild(box);
}

// Bar chart: one bar per year, number of people, percentage of the population on top
function drawTrend(area, trend) {
  if (trend.length === 0) {
    showEmpty(area, "Chart coming soon: survey figures by year (Design & Content).");
    return;
  }
  const width = 420;
  const height = 260;
  const top = 40;
  const bottom = 40;
  const max = Math.max.apply(null, trend.map(function (t) { return t.people; }));
  const slot = width / trend.length;
  const barWidth = Math.min(80, slot * 0.6);
  const svg = svgNode("svg", { viewBox: "0 0 " + width + " " + height, role: "img" });
  const summary = trend.map(function (t) {
    return t.year + ": " + t.people.toLocaleString("en") + " people (" + t.percent + "%)";
  }).join("; ");
  svg.appendChild(svgNode("title", {}, summary));
  svg.appendChild(svgNode("line", {
    x1: 0, y1: height - bottom, x2: width, y2: height - bottom,
    stroke: "#767676", "stroke-width": 2
  }));
  for (let i = 0; i < trend.length; i++) {
    const t = trend[i];
    const barHeight = (height - top - bottom) * t.people / max;
    const x = slot * i + (slot - barWidth) / 2;
    const y = height - bottom - barHeight;
    svg.appendChild(svgNode("rect", { x: x, y: y, width: barWidth, height: barHeight, fill: CHART_COLORS[0] }));
    svg.appendChild(svgNode("text", {
      x: x + barWidth / 2, y: y - 22, "text-anchor": "middle", "font-size": 15, "font-weight": 700, fill: "#1f1f1f"
    }, t.percent + "%"));
    svg.appendChild(svgNode("text", {
      x: x + barWidth / 2, y: y - 6, "text-anchor": "middle", "font-size": 12, fill: "#595959"
    }, t.people.toLocaleString("en")));
    svg.appendChild(svgNode("text", {
      x: x + barWidth / 2, y: height - bottom + 22, "text-anchor": "middle", "font-size": 14, fill: "#1f1f1f"
    }, String(t.year)));
  }
  area.innerHTML = "";
  area.appendChild(svg);
}

// Pie chart with a legend that repeats every label and percentage
function drawPie(area, groups) {
  if (groups.length === 0) {
    showEmpty(area, "Chart coming soon: age groups (Design & Content).");
    return;
  }
  const total = groups.reduce(function (sum, g) { return sum + g.percent; }, 0);
  const svg = svgNode("svg", { viewBox: "-110 -110 220 220", role: "img" });
  svg.appendChild(svgNode("title", {}, groups.map(function (g) {
    return g.label + ": " + g.percent + "%";
  }).join("; ")));
  let angle = -Math.PI / 2; // start at 12 o'clock
  for (let i = 0; i < groups.length; i++) {
    const share = groups[i].percent / total;
    const end = angle + share * 2 * Math.PI;
    const color = CHART_COLORS[i % CHART_COLORS.length];
    if (share >= 0.999) {
      svg.appendChild(svgNode("circle", { cx: 0, cy: 0, r: 100, fill: color }));
    } else {
      const large = share > 0.5 ? 1 : 0;
      const d = "M0 0 L" + (100 * Math.cos(angle)) + " " + (100 * Math.sin(angle)) +
        " A100 100 0 " + large + " 1 " + (100 * Math.cos(end)) + " " + (100 * Math.sin(end)) + " Z";
      svg.appendChild(svgNode("path", { d: d, fill: color, stroke: "#ffffff", "stroke-width": 2 }));
    }
    angle = end;
  }
  const legend = document.createElement("ul");
  legend.className = "chart-legend";
  for (let i = 0; i < groups.length; i++) {
    const item = document.createElement("li");
    const swatch = document.createElement("span");
    swatch.style.background = CHART_COLORS[i % CHART_COLORS.length];
    item.appendChild(swatch);
    item.appendChild(document.createTextNode(groups[i].label + ": " + groups[i].percent + "%"));
    legend.appendChild(item);
  }
  area.innerHTML = "";
  area.appendChild(svg);
  area.appendChild(legend);
}

// Three text samples on white, from hard to read to best
const CONTRAST_SAMPLES = [
  { color: "#a6a6a6", note: "Too light: fails" },
  { color: "#767676", note: "Just passes AA (normal text)" },
  { color: "#595959", note: "Passes AAA" }
];

function showSamples(container) {
  for (let i = 0; i < CONTRAST_SAMPLES.length; i++) {
    const sample = CONTRAST_SAMPLES[i];
    const ratio = contrast(sample.color, "#ffffff");
    const card = document.createElement("div");
    card.className = "contrast-sample";
    card.style.background = "#ffffff";
    const text = document.createElement("p");
    text.className = "sample-text";
    text.style.color = sample.color;
    text.textContent = "Club fair this Friday";
    const info = document.createElement("p");
    info.className = "sample-ratio";
    info.textContent = formatRatio(ratio) + ":1 · " + sample.note;
    card.appendChild(text);
    card.appendChild(info);
    container.appendChild(card);
  }
}

if (typeof BACKGROUND_STATS !== "undefined") {
  document.getElementById("trendCaption").textContent = BACKGROUND_STATS.trendTitle;
  document.getElementById("ageCaption").textContent = BACKGROUND_STATS.ageTitle;
  document.getElementById("statsSource").textContent = BACKGROUND_STATS.source;
  drawTrend(document.getElementById("trendChart"), BACKGROUND_STATS.trend);
  drawPie(document.getElementById("ageChart"), BACKGROUND_STATS.ageGroups);
}
showSamples(document.getElementById("contrastSamples"));
