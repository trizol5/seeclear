/*
  color.js - shared colour functions for all SeeClear pages
  Owner: Programmer A. Other pages call these functions but do not edit them;
  ask Programmer A if you need a new one.

  Contrast follows WCAG 2.x:
  https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
  https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
*/

// WCAG contrast thresholds
const AA_NORMAL = 4.5;
const AAA_NORMAL = 7;
const AA_LARGE = 3;
const AAA_LARGE = 4.5;

// "#1A73E8", "1a73e8" or "#1ae" -> "#1a73e8"; anything else -> null
function normalizeHex(hex) {
  if (typeof hex !== "string") {
    return null;
  }
  let value = hex.trim().toLowerCase();
  if (value.charAt(0) === "#") {
    value = value.slice(1);
  }
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/.test(value)) {
    return null;
  }
  // Short form: each digit is doubled, so "1ae" becomes "11aaee"
  if (value.length === 3) {
    value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
  }
  return "#" + value;
}

// "#1A73E8" -> [26, 115, 232]; invalid input -> null
function hexToRgb(hex) {
  const clean = normalizeHex(hex);
  if (clean === null) {
    return null;
  }
  const r = parseInt(clean.slice(1, 3), 16);
  const g = parseInt(clean.slice(3, 5), 16);
  const b = parseInt(clean.slice(5, 7), 16);
  return [r, g, b];
}

// (26, 115, 232) -> "#1a73e8"; values are rounded and kept within 0-255
function rgbToHex(r, g, b) {
  const channels = [r, g, b];
  let hex = "#";
  for (let i = 0; i < channels.length; i++) {
    const value = Math.min(255, Math.max(0, Math.round(channels[i])));
    hex += value.toString(16).padStart(2, "0");
  }
  return hex;
}

// One sRGB channel (0-255) -> linear value (0-1), the gamma correction step
function linearChannel(value) {
  const c = value / 255;
  if (c <= 0.04045) {
    return c / 12.92;
  }
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

// [r, g, b] -> relative luminance, 0 (black) to 1 (white)
function luminance(rgb) {
  const r = linearChannel(rgb[0]);
  const g = linearChannel(rgb[1]);
  const b = linearChannel(rgb[2]);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Contrast ratio of two hex colours, from 1 to 21; invalid input -> null
function contrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (rgb1 === null || rgb2 === null) {
    return null;
  }
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Contrast ratio for display, e.g. 4.4776 -> "4.47"
// Truncates instead of rounding so 4.499 never shows as a passing "4.50"
function formatRatio(ratio) {
  return (Math.floor(ratio * 100) / 100).toFixed(2);
}

// Contrast ratio -> "AAA", "AA" or "Fail"
// largeText = true for text at least 24px, or at least 18.66px bold
function rating(ratio, largeText) {
  const aaa = largeText ? AAA_LARGE : AAA_NORMAL;
  const aa = largeText ? AA_LARGE : AA_NORMAL;
  if (ratio >= aaa) {
    return "AAA";
  } else if (ratio >= aa) {
    return "AA";
  } else {
    return "Fail";
  }
}
