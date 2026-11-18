(() => {
    const NS = "http://www.w3.org/2000/svg";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const makeSvg = (tag, attrs = {}) => {
        const node = document.createElementNS(NS, tag);
        Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
        return node;
    };

    // Combined chart: people count uses the left scale; population share uses the right.
    const chart = document.getElementById("population-chart");
    const years = [2009, 2013, 2020];
    const population = [12.26, 16.61, 19.96];
    const share = [1.8, 2.3, 2.7];
    const plot = { left: 76, right: 684, top: 48, bottom: 316 };
    const yCount = value => plot.bottom - (value / 22) * (plot.bottom - plot.top);
    const yShare = value => plot.bottom - (value / 3) * (plot.bottom - plot.top);
    const xs = [185, 380, 575];

    for (let tick = 0; tick <= 20; tick += 5) {
        const y = yCount(tick);
        chart.append(makeSvg("line", { x1: plot.left, y1: y, x2: plot.right, y2: y, class: "chart-gridline" }));
        const leftLabel = makeSvg("text", { x: plot.left - 10, y: y + 4, "text-anchor": "end", class: "chart-tick" });
        leftLabel.textContent = tick === 0 ? "0" : `${tick}w`;
        chart.append(leftLabel);

        const percent = (tick / 20 * 3).toFixed(1).replace(".0", "");
        const rightLabel = makeSvg("text", { x: plot.right + 10, y: y + 4, "text-anchor": "start", class: "chart-tick" });
        rightLabel.textContent = `${percent}%`;
        chart.append(rightLabel);
    }

    chart.append(makeSvg("line", { x1: plot.left, y1: plot.top, x2: plot.left, y2: plot.bottom, class: "chart-axis" }));
    chart.append(makeSvg("line", { x1: plot.right, y1: plot.top, x2: plot.right, y2: plot.bottom, class: "chart-axis" }));
    chart.append(makeSvg("line", { x1: plot.left, y1: plot.bottom, x2: plot.right, y2: plot.bottom, class: "chart-axis" }));

    const leftTitle = makeSvg("text", { x: 18, y: (plot.top + plot.bottom) / 2, transform: `rotate(-90 18 ${(plot.top + plot.bottom) / 2})`, "text-anchor": "middle", class: "chart-axis-title" });
    leftTitle.textContent = "Population (w)";
    chart.append(leftTitle);
    const rightTitle = makeSvg("text", { x: 742, y: (plot.top + plot.bottom) / 2, transform: `rotate(90 742 ${(plot.top + plot.bottom) / 2})`, "text-anchor": "middle", class: "chart-axis-title" });
    rightTitle.textContent = "Share of population";
    chart.append(rightTitle);

    const bars = population.map((value, index) => {
        const targetY = yCount(value);
        const rect = makeSvg("rect", { x: xs[index] - 34, y: plot.bottom, width: 68, height: 0, rx: 5, class: "chart-bar" });
        chart.append(rect);
        const valueLabel = makeSvg("text", { x: xs[index], y: targetY + 19, "text-anchor": "middle", class: "chart-value chart-bar-value" });
        valueLabel.textContent = `${value.toFixed(2)}w`;
        chart.append(valueLabel);
        const yearLabel = makeSvg("text", { x: xs[index], y: plot.bottom + 27, "text-anchor": "middle", class: "chart-year" });
        yearLabel.textContent = String(years[index]);
        chart.append(yearLabel);
        return { rect, targetY, height: plot.bottom - targetY };
    });

    const points = share.map((value, index) => [xs[index], yShare(value)]);
    const pathData = points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");
    const line = makeSvg("path", { d: pathData, class: "chart-line" });
    chart.append(line);
    const lineLength = line.getTotalLength();
    if (!reducedMotion) {
        line.style.strokeDasharray = String(lineLength);
        line.style.strokeDashoffset = String(lineLength);
    }
    points.forEach(([x, y], index) => {
        chart.append(makeSvg("circle", { cx: x, cy: y, r: 6, class: "chart-point chart-line-marker", opacity: 0 }));
        const label = makeSvg("text", { x, y: y - 13, "text-anchor": "middle", class: "chart-value chart-line-marker", opacity: 0 });
        label.textContent = `${share[index].toFixed(1)}%`;
        chart.append(label);
    });

    const animateBar = ({ rect, targetY, height }) => new Promise(resolve => {
        if (reducedMotion) {
            rect.setAttribute("y", targetY);
            rect.setAttribute("height", height);
            resolve();
            return;
        }
        const duration = height * 5; // Linear motion at a constant pixel speed.
        const start = performance.now();
        const frame = now => {
            const progress = Math.min((now - start) / duration, 1);
            rect.setAttribute("y", plot.bottom - height * progress);
            rect.setAttribute("height", height * progress);
            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
        };
        requestAnimationFrame(frame);
    });

    const animateLine = () => {
        if (reducedMotion) {
            chart.querySelectorAll(".chart-line-marker").forEach(marker => marker.setAttribute("opacity", "1"));
            return;
        }
        line.animate([{ strokeDashoffset: lineLength }, { strokeDashoffset: 0 }], {
            duration: 1500,
            easing: "linear",
            fill: "forwards"
        });
        window.setTimeout(() => {
            chart.querySelectorAll(".chart-line-marker").forEach(marker => {
                marker.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, fill: "forwards" });
            });
        }, 1500);
    };

    Promise.all(bars.map(animateBar)).then(animateLine);

    // Age distribution; labels show percentages only, while the legend names each group.
    const ageChart = document.getElementById("age-chart");
    const legend = document.getElementById("age-legend");
    const ages = [
        ["15岁以下", 1.6, "#4e79a7"],
        ["15–29岁", 1.6, "#f28e2b"],
        ["30–39岁", 1.3, "#e15759"],
        ["40–49岁", 3.6, "#76b7b2"],
        ["50–59岁", 8.8, "#59a14f"],
        ["60–64岁", 9.6, "#edc948"],
        ["65–69岁", 11.9, "#b07aa1"],
        ["70岁及以上", 61.6, "#ff9da7"]
    ];
    const center = 160;
    const radius = 142;
    const startAngle = -Math.PI / 2;
    const pieSlices = [];
    let accumulated = 0;

    const sectorPath = (fromAngle, toAngle) => {
        if (toAngle <= fromAngle) return "";
        const x1 = center + radius * Math.cos(fromAngle);
        const y1 = center + radius * Math.sin(fromAngle);
        const x2 = center + radius * Math.cos(toAngle);
        const y2 = center + radius * Math.sin(toAngle);
        const largeArc = toAngle - fromAngle > Math.PI ? 1 : 0;
        return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    ages.forEach(([label, value, color]) => {
        const path = makeSvg("path", {
            d: "",
            fill: color,
            class: "age-slice"
        });
        ageChart.append(path);
        pieSlices.push({ path, start: startAngle + accumulated * Math.PI * 2, end: startAngle + (accumulated + value / 100) * Math.PI * 2 });
        accumulated += value / 100;

        const item = document.createElement("li");
        const swatch = document.createElement("span");
        swatch.className = "age-legend-swatch";
        swatch.style.backgroundColor = color;
        swatch.setAttribute("aria-hidden", "true");
        const text = document.createElement("span");
        text.textContent = `${label} · ${value.toFixed(1)}%`;
        item.append(swatch, text);
        legend.append(item);
    });

    const drawPie = progress => {
        const currentAngle = startAngle + progress * Math.PI * 2;
        pieSlices.forEach(({ path, start, end }) => {
            const sliceEnd = Math.min(end, currentAngle);
            path.setAttribute("d", sectorPath(start, sliceEnd));
        });
    };

    if (reducedMotion) {
        drawPie(1);
    } else {
        const duration = 2600;
        const startTime = performance.now();
        const animatePie = now => {
            const progress = Math.min((now - startTime) / duration, 1);
            drawPie(progress);
            if (progress < 1) requestAnimationFrame(animatePie);
        };
        requestAnimationFrame(animatePie);
    }
})();
