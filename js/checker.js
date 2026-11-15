console.log("checker.js loaded");
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.min.js';
console.log("PDF.js worker ready");
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
const gradientToggle = document.getElementById("gradient-toggle");
const gradientOptions = document.getElementById("gradient-options");
const gradientEndInput = document.getElementById("gradient-end");
const suggestionSwatch = document.getElementById("suggestion-swatch");
const button = document.getElementById("apply-suggestion");
const dropZone = document.getElementById("drop-zone");
const fileError = document.getElementById("file-error");
let currentSuggestion = "";
function showResult(li, label, target, ratio) {
    if (ratio >= target) {
        li.textContent = `✔ ${label} (${target}:1)`;
    } else {
        li.textContent = `✖ ${label} (${target}:1)`;
    }
}
function update() {
    const textColor = textColorInput.value;
    const backgroundColor = backgroundColorInput.value;
    const gradientEndColor = gradientEndInput.value;
    preview.style.color = textColor;

    let ratio = contrast(textColor, backgroundColor);
    
    if (gradientToggle.checked) {
        preview.style.background = `linear-gradient(to right, ${backgroundColor}, ${gradientEndColor})`;
    } else {
        preview.style.background = backgroundColor;
    }
    
    let ratio2 = contrast(textColor, gradientEndInput.value);
    if (gradientToggle.checked) {
        ratio = Math.min(ratio, ratio2);
        
    } 
    ratio = (Math.floor(ratio * 100)) / 100;
    let worstBg=backgroundColor;
    if(gradientToggle.checked && ratio2< contrast(textColor, backgroundColor)) {
        worstBg = gradientEndInput.value;
    }
    if(gradientToggle.checked) {
        contrastRatioOutput.textContent = `Lowest contrast across the gradient: ${ratio}:1`;
    } else {
        contrastRatioOutput.textContent = `Contrast Ratio: ${ratio}:1`;
    }
    if(ratio < 4.5) {
        currentSuggestion = suggestColor(textColor, worstBg, 4.5);
        document.getElementById("suggestion").textContent = `Suggested text color for AA normal: ${currentSuggestion}`;
        suggestionSwatch.style.backgroundColor = currentSuggestion;
        suggestionSwatch.setAttribute("aria-label", `Suggested color ${currentSuggestion}`);
        suggestionSwatch.hidden = false;
        button.hidden = false;
    } else {
        currentSuggestion = "";
        document.getElementById("suggestion").textContent = "";
        button.hidden = true;
        suggestionSwatch.hidden = true;
        suggestionSwatch.setAttribute("aria-label", `No suggestion`);
    }
    showResult(aaLargeOutput, "AA large", 3, ratio);
    showResult(aaNormalOutput, "AA normal", 4.5, ratio);
    showResult(aaaOutput, "AAA", 7, ratio);
}
function suggestColor(textHex, bgHex, target) {
    let goDark = false;
    let rgb = hexToRgb(textHex);
    goDark = contrast(bgHex, "#000000") > contrast(bgHex, "#ffffff");
    let steps= 0;
    while (contrast(rgbToHex(rgb), bgHex) < target && steps < 255) {
        for(let i = 0; i < 3; i++) {
            if (goDark) {
                rgb[i] = Math.max(0, rgb[i] - 1);
            } else {
                rgb[i] = Math.min(255, rgb[i] + 1);
            }
        }
        steps++;
    }
    return rgbToHex(rgb);

}
async function loadFile(file) {
    
    if (file === undefined) {
        return;
    }
    if(!file.type.startsWith("image/") && file.type !== "application/pdf") {
        fileError.textContent = "Please upload an image or PDF file.";
        return;
    }else{
        fileError.textContent = "";
    }
    if (file.type === "application/pdf") {
        let data = await file.arrayBuffer();
        let pdf = await pdfjsLib.getDocument({ data: data }).promise;
        let page = await pdf.getPage(1);
        let viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    } else {
        const img = new Image();

        img.onload = function () {
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = URL.createObjectURL(file);
    }
}
imageUpload.addEventListener("change", function () {
    let file = this.files[0];
    loadFile(file);

});
ctx.canvas.addEventListener("click", function (event) {
    let x = event.offsetX;
    let y = event.offsetY;
    let scaleX = canvas.width / canvas.clientWidth;
    let scaleY = canvas.height / canvas.clientHeight;
    x = Math.floor(x * scaleX);
    y = Math.floor(y * scaleY);
    let pixel = ctx.getImageData(x, y, 1, 1).data;
    let hex = rgbToHex([pixel[0], pixel[1], pixel[2]]);
    let colorType = document.querySelector('input[name="color-type"]:checked').value;
    if (colorType === "text") {
        textColorInput.value = hex;
    } else {
        backgroundColorInput.value = hex;
    }
    update();

});
gradientToggle.addEventListener("change", function () {
    if (this.checked) {
        gradientOptions.hidden = false;
    } else {
        gradientOptions.hidden = true;
    }
    update();
});
button.addEventListener("click", function () {
    if (currentSuggestion !== "") {
        textColorInput.value = currentSuggestion;
        update();
    }
});
dropZone.addEventListener("dragover", function (event) {
    event.preventDefault();
    this.classList.add("dragover");
});
dropZone.addEventListener("dragleave", function (event) {
    event.preventDefault();
    this.classList.remove("dragover");
});
dropZone.addEventListener("drop", function (event) {
    event.preventDefault();
    this.classList.remove("dragover");
    let file = event.dataTransfer.files[0];
    loadFile(file);
});
gradientEndInput.addEventListener("input", update);
backgroundColorInput.addEventListener("input", update);
textColorInput.addEventListener("input", update);
update();