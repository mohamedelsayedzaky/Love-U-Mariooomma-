/* =========================
   التنقل بين الصفحات
========================= */

const pageHooks = {
    "page-love": startLovePage
};

function goTo(id) {

    const target = document.getElementById(id);

    if (!target) return;

    document.getElementById("intro").classList.add("hide");

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    target.classList.add("active");
    target.scrollTop = 0;

    if (pageHooks[id]) {
        setTimeout(pageHooks[id], 700);
    }
}


/* =========================
   كتابة حرف حرف
========================= */

function typeInto(el, text, speed, done) {

    let n = 0;

    (function step() {

        if (n < text.length) {
            el.textContent += text.charAt(n);
            n++;
            setTimeout(step, speed);
        } else if (done) {
            done();
        }

    })();
}

function showBlock(id) {

    const el = document.getElementById(id);

    el.classList.add("shown");

    // نستنى فريم عشان الانتقال يشتغل
    requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add("visible"));
    });

    setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
}


/* =========================
   صفحة: بمناسبة إني بحبك
========================= */

let lovePageStarted = false;

function startLovePage() {

    if (lovePageStarted) return;
    lovePageStarted = true;

    typeInto(
        document.getElementById("loveLine1"),
        "مش لازم يبقى بمناسبة حاجة...",
        55,
        () => {
            typeInto(
                document.getElementById("loveLine2"),
                "ممكن بمناسبة إني بحبك 🫶🏻",
                60,
                () => setTimeout(() => showBlock("octBox"), 600)
            );
        }
    );
}


/* =========================
   استبيان: فاكرة ولا لا
========================= */

function answerMemory(remembers) {

    document.getElementById("yesBtn").disabled = true;
    document.getElementById("noBtn").disabled = true;

    document.getElementById("memoryMsg").textContent = remembers
        ? "شطوووووره🥳 يلا جيبي اليوم صح بقى"
        : "ولا يهمك 😆 بس برضو لازم تجيبي اليوم صح";

    setTimeout(() => showBlock("dateStep"), 700);
}


/* =========================
   عداد اليوم
========================= */

const CORRECT_DAY = 15;

let day = 1;
let wrongTries = 0;

const wrongMessages = [
    "لا لا لا 😆 جربي تاني",
    "مش هقولك صح ولا غلط... لا استنى، غلط 😏",
    "تلميح: اليوم ده في نص الشهر تقريباً 😉"
];

function changeDay(step) {

    day = ((day - 1 + step + 31) % 31) + 1;

    document.getElementById("dayValue").textContent = day;
}

function checkDay() {

    const msg = document.getElementById("dateMsg");
    const row = document.getElementById("dateRow");

    if (day === CORRECT_DAY) {

        msg.textContent = "تحياتي 🫡";

        setTimeout(() => goTo("page-teaser"), 1200);

        return;
    }

    wrongTries++;

    let text = wrongMessages[Math.min(wrongTries, wrongMessages.length) - 1];

    if (wrongTries >= 5) {
        text += day < CORRECT_DAY
            ? " (أكبر شوية ⬆️)"
            : " (أصغر شوية ⬇️)";
    }

    msg.textContent = text;

    row.classList.remove("shake");
    void row.offsetWidth;
    row.classList.add("shake");
}