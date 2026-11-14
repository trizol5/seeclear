function hexToRgb(hex) {
    const r = hex.substring(1, 3);
    const g = hex.substring(3, 5);
    const b = hex.substring(5, 7);
    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}
function linearChannel(value){
    value /= 255;
    if(value <= 0.04045){
        return value / 12.92;
    } else {
        return Math.pow((value + 0.055) / 1.055, 2.4);
    }
}

function luminance(rgb) {
    const r = linearChannel(rgb[0]);
    const g = linearChannel(rgb[1]);
    const b = linearChannel(rgb[2]);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(hex1,hex2){
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const lum1 = luminance(rgb1);
    const lum2 = luminance(rgb2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHex(rgb) {
    const r = rgb[0].toString(16).padStart(2, '0');
    const g = rgb[1].toString(16).padStart(2, '0');
    const b = rgb[2].toString(16).padStart(2, '0');
    return '#' + r + g + b;
}