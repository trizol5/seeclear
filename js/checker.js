console.log("checker.js loaded");
const textColorInput = document.getElementById("text-color");
const backgroundColorInput = document.getElementById("background-color");
const contrastRatioOutput = document.getElementById("contrast-ratio");
const aaNormalOutput = document.getElementById("aa-normal");
const aaLargeOutput = document.getElementById("aa-large");
const aaaOutput = document.getElementById("aaa");
const preview = document.getElementById("preview");
const imageUpload = document.getElementById("image-upload");
const canvas = document.getElementById("image-canvas");
const ctx = canvas.getContext("2d");
function showResult(li,label,target,ratio) {
    if(ratio >= target){
        li.textContent = `✔ ${label} (${target}:1)`;
    } else {
        li.textContent = `✖ ${label} (${target}:1)`;
    }
}
function update(){
    const textColor = textColorInput.value;
    const backgroundColor = backgroundColorInput.value;
    preview.style.color = textColor;
    preview.style.backgroundColor = backgroundColor;
    let ratio = contrast(textColor, backgroundColor);
    ratio = (Math.floor(ratio * 100) )/ 100;
    contrastRatioOutput.textContent = `Contrast Ratio: ${ratio}:1`;
    showResult(aaLargeOutput,"AA large",3,ratio);
    showResult(aaNormalOutput,"AA normal",4.5,ratio);
    showResult(aaaOutput,"AAA",7,ratio);
}
imageUpload.addEventListener("change", function() {
    let file = this.files[0];
    if(file===undefined){
        return;
    }
    const img = new Image();
    
    img.onload = function() {
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    }
    img.src = URL.createObjectURL(file);
});
ctx.canvas.addEventListener("click", function(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    let scaleX=canvas.width/canvas.clientWidth;
    let scaleY=canvas.height/canvas.clientHeight;
    x=Math.floor(x*scaleX);
    y=Math.floor(y*scaleY);
    let pixel = ctx.getImageData(x, y, 1, 1).data;
    let hex = rgbToHex([pixel[0], pixel[1], pixel[2]]);
    let colorType = document.querySelector('input[name="color-type"]:checked').value;
    if(colorType === "text") {
        textColorInput.value = hex;
    } else {
        backgroundColorInput.value = hex;
    }
    update();

});
backgroundColorInput.addEventListener("input", update);
textColorInput.addEventListener("input", update);
update();