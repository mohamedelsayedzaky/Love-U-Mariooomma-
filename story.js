/* =========================
   تحميل الصور (مع بدائل مؤقتة)
========================= */

const IMG_EXTS = ["jpg", "webp", "jpeg", "png"];
const STICKER_EXTS = ["jpg", "png", "jpeg", "webp"];

function placeholder(label, w, h) {

    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
        `<rect width="100%" height="100%" rx="18" fill="#26233f"/>` +
        `<text x="50%" y="50%" fill="#f5b6d2" font-size="56" font-family="Arial" ` +
        `text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;

    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function loadAsset(img, base, exts, label, w, h, onDone) {

    let k = 0;

    img.onload = () => { if (onDone) onDone(); };

    img.onerror = () => {

        k++;

        if (k < exts.length) {
            img.src = `${base}.${exts[k]}`;
        } else {
            img.onerror = null;
            img.src = placeholder(label, w, h);
        }
    };

    img.src = `${base}.${exts[0]}`;
}


/* =========================
   السهم المنحني مع السكرول
========================= */

const SVG_NS = "http://www.w3.org/2000/svg";
const storyState = {};

function svgEl(name, attrs) {

    const el = document.createElementNS(SVG_NS, name);

    for (const key in attrs) {
        el.setAttribute(key, attrs[key]);
    }

    return el;
}

function initStory(pageId) {

    if (storyState[pageId]) {
        storyState[pageId].rebuild();
        return;
    }

    const page = document.getElementById(pageId);
    const inner = page.querySelector(".story-inner");

    const svg = svgEl("svg", { class: pageId === "page-final" ? "arrows-svg arrows-final" : "arrows-svg" });
    inner.prepend(svg);

    let arrows = [];
    let timer;

    function schedule() {
        clearTimeout(timer);
        timer = setTimeout(rebuild, 80);
    }

    function rebuild() {

        svg.innerHTML = "";
        arrows = [];

        const ir = inner.getBoundingClientRect();

        svg.setAttribute("width", ir.width);
        svg.setAttribute("height", ir.height);
        svg.setAttribute("viewBox", `0 0 ${ir.width} ${ir.height}`);

        const shots = [...inner.querySelectorAll(".story-row .shot:not(.no-arrow)")]
            .filter(s => s.getClientRects().length > 0);
        const isMobile = window.matchMedia("(max-width: 700px)").matches;

        for (let n = 0; n < shots.length - 1; n++) {

            const a = shots[n].getBoundingClientRect();
            const b = shots[n + 1].getBoundingClientRect();

            const x1 = a.left + a.width / 2 - ir.left;
            const rowA = shots[n].closest(".story-row").getBoundingClientRect();
            const rowB = shots[n + 1].closest(".story-row").getBoundingClientRect();
            const y1 = isMobile ? rowA.bottom - ir.top + 14 : a.bottom - ir.top + 6;
            const x2 = b.left + b.width / 2 - ir.left;
            const y2 = isMobile ? rowB.top - ir.top - 14 : b.top - ir.top - 10;
            const dy = y2 - y1;

            const d = isMobile
                ? `M${x1},${y1} C${x1 + (x2 > x1 ? 34 : -34)},${y1 + dy * 0.32} ${x2 + (x2 > x1 ? -34 : 34)},${y2 - dy * 0.32} ${x2},${y2}`
                : `M${x1},${y1} C${x1},${y1 + dy * 0.7} ${x2},${y2 - dy * 0.7} ${x2},${y2}`;

            const path = svgEl("path", { d: d, class: "arrow-path" });
            const head = svgEl("path", { d: "M-9,-8 L3,0 L-9,8", class: "arrow-head" });

            svg.append(path, head);

            const len = path.getTotalLength();

            // قلوب على طول السهم، بتظهر مع رسمه
            const hearts = [];
            const count = Math.max(2, Math.floor(len / 85));

            for (let k = 1; k <= count; k++) {

                const pos = k / (count + 1);
                const hp = path.getPointAtLength(len * pos);

                const t = svgEl("text", {
                    x: hp.x,
                    y: hp.y,
                    class: "arrow-heart",
                    "text-anchor": "middle",
                    "dominant-baseline": "central"
                });

                t.textContent = "♥";
                svg.append(t);

                hearts.push({ el: t, pos: pos });
            }

            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;

            arrows.push({ path: path, head: head, hearts: hearts, len: len, y1: y1, y2: y2, cur: 0, target: 0 });
        }

        update(true);
    }

    // السكرول بيحدد "الهدف" بس، والسهم بيلحقه بالتدريج (حركة سلسة)
    function update(jump) {

        if (!arrows.length) return;

        const pr = page.getBoundingClientRect();
        const ir = inner.getBoundingClientRect();

        // الخط اللي السهم بيترسم لحد عنده (75% من ارتفاع الشاشة)
        const viewY = pr.top + page.clientHeight * 0.75 - ir.top;

        arrows.forEach(a => {

            a.target = Math.max(0, Math.min(1, (viewY - a.y1) / (a.y2 - a.y1)));

            if (jump) a.cur = a.target;
        });

        if (jump) {
            arrows.forEach(drawArrow);
        } else {
            startLoop();
        }
    }

    function drawArrow(a) {

        const p = a.cur;

        a.path.style.strokeDashoffset = a.len * (1 - p);

        a.hearts.forEach(hh => {
            hh.el.style.opacity = p >= hh.pos ? 1 : 0;
        });

        if (p <= 0.005) {
            a.head.style.opacity = 0;
            return;
        }

        const L = a.len * p;
        const pt = a.path.getPointAtLength(L);
        const pt0 = a.path.getPointAtLength(Math.max(0, L - 2));
        const angle = Math.atan2(pt.y - pt0.y, pt.x - pt0.x) * 180 / Math.PI;

        a.head.style.opacity = 1;
        a.head.setAttribute("transform", `translate(${pt.x},${pt.y}) rotate(${angle})`);
    }

    let looping = false;
    let previousTick = 0;

    function startLoop() {

        if (looping) return;

        looping = true;
        previousTick = 0;

        requestAnimationFrame(tick);
    }

    function tick(now) {

        const elapsed = previousTick ? Math.min(now - previousTick, 50) : 16.67;
        previousTick = now;
        const easing = 1 - Math.exp(-elapsed / 125);
        let moving = false;

        arrows.forEach(a => {

            const diff = a.target - a.cur;

            if (Math.abs(diff) > 0.0005) {
                a.cur += diff * easing;
                moving = true;
            } else {
                a.cur = a.target;
            }

            drawArrow(a);
        });

        if (moving) {
            requestAnimationFrame(tick);
        } else {
            looping = false;
        }
    }

    // الصور
    page.querySelectorAll("img[data-n]").forEach(img => {
        loadAsset(img, `images/${img.dataset.n}`, IMG_EXTS, img.dataset.n, 300, 400, schedule);
    });

    // الستيكرز
    page.querySelectorAll("img[data-s]").forEach(img => {
        loadAsset(img, `images/S${img.dataset.s}`, STICKER_EXTS, "S" + img.dataset.s, 200, 200, schedule);
    });

    page.addEventListener("scroll", () => update(false), { passive: true });
    window.addEventListener("resize", schedule);

    storyState[pageId] = { rebuild: rebuild };

    rebuild();
}

["page-story1", "page-story2", "page-story4", "page-story5"].forEach(id => {
    pageHooks[id] = () => initStory(id);
});
