/* =========================
   النجوم
========================= */

const starsContainer =
    document.getElementById("stars");

for (let i = 0; i < 120; i++) {

    const star =
        document.createElement("div");

    star.className = "star";

    star.style.left =
        Math.random() * 100 + "%";

    star.style.top =
        Math.random() * 100 + "%";

    star.style.animationDelay =
        Math.random() * 2 + "s";

    star.style.opacity =
        Math.random();

    starsContainer.appendChild(star);
}


/* =========================
   الأسماء العائمة
========================= */

const floatingNames =
    document.getElementById("floatingNames");

const names = [
    "حموكشه",
    "مريومه",
    "Hamoksha",
    "Marioomma"
];


function createFloatingNames() {

    /*
       عدد الكلمات
    */

    for (let i = 0; i < 30; i++) {

        const name =
            document.createElement("div");

        name.className =
            "floating-name";


        /*
           اختيار اسم عشوائي
        */

        name.textContent =
            names[
                Math.floor(
                    Math.random() *
                    names.length
                )
            ];


        /*
           حجم مختلف لكل كلمة
        */

        const size =
            18 +
            Math.random() * 32;

        name.style.fontSize =
            size + "px";


        /*
           مكان الكلمة على الشاشة
        */

        name.style.left =
            Math.random() * 100 + "%";

        name.style.top =
            Math.random() * 100 + "%";


        /*
           نقطة الحركة الأولى
        */

        const x1 =
            -45 +
            Math.random() * 90;

        const y1 =
            -35 +
            Math.random() * 70;


        /*
           نقطة الحركة الثانية

           مختلفة عن الأولى
           عشان الحركة تبقى واضحة
        */

        const x2 =
            -45 +
            Math.random() * 90;

        const y2 =
            -35 +
            Math.random() * 70;


        name.style.setProperty(
            "--x1",
            x1 + "vw"
        );

        name.style.setProperty(
            "--y1",
            y1 + "vh"
        );

        name.style.setProperty(
            "--x2",
            x2 + "vw"
        );

        name.style.setProperty(
            "--y2",
            y2 + "vh"
        );


        /*
           دوران بسيط
        */

        const rotation =
            -18 +
            Math.random() * 36;

        name.style.setProperty(
            "--rotation",
            rotation + "deg"
        );


        /*
           سرعة مختلفة

           8 إلى 20 ثانية
        */

        const duration =
            8 +
            Math.random() * 12;

        name.style.setProperty(
            "--duration",
            duration + "s"
        );


        /*
           كل كلمة تبدأ من نقطة
           مختلفة في الحركة
        */

        name.style.animationDelay =
            (-Math.random() * duration) + "s";


        floatingNames.appendChild(name);
    }
}


createFloatingNames();


/* =========================
   بداية التجربة
========================= */

function startExperience() {

    const intro =
        document.getElementById("intro");

    const main =
        document.getElementById("main");


    intro.classList.add("hide");


    setTimeout(() => {

        main.classList.add("show");

        setTimeout(
            typeText,
            700
        );

    }, 500);

}


/* =========================
   الكتابة حرف حرف
========================= */

const typingText =
    "في حاجات بسيطة بنعملها... بس بتكون معمولة لشخص معين.";

const subText =
    "ودي واحدة من الحاجات البسيطة دي ❤️";


let i = 0;
let j = 0;


function typeText() {

    const typing =
        document.getElementById("typing");


    if (i < typingText.length) {

        typing.innerText +=
            typingText.charAt(i);

        i++;

        setTimeout(
            typeText,
            55
        );

    } else {

        setTimeout(
            typeSubText,
            500
        );

    }

}


function typeSubText() {

    const sub =
        document.getElementById("sub-message");


    if (j < subText.length) {

        sub.innerText +=
            subText.charAt(j);

        j++;

        setTimeout(
            typeSubText,
            45
        );

    } else {

        document
            .getElementById("continueBtn")
            .classList.add("visible");

    }

}


/* =========================
   BLUE HEART
   PYTHON VERSION
========================= */

const heartCanvas =
    document.getElementById(
        "heartCanvas"
    );

const heartScene =
    document.getElementById(
        "heartScene"
    );

const loveMusic =
    document.getElementById(
        "loveMusic"
    );

const ctx =
    heartCanvas.getContext("2d");


const WORDS = [
    "love you",
    "Love You",
    "LOVE YOU"
];


const COLORS = [
    [70, 130, 180],
    [30, 144, 255],
    [0, 191, 255],
    [100, 149, 237],
    [65, 105, 225]
];


const SCALE = 20;


let particles = [];

let animationStarted =
    false;


/* =========================
   حجم الشاشة
========================= */

function resizeHeartCanvas() {

    heartCanvas.width =
        window.innerWidth;

    heartCanvas.height =
        window.innerHeight;

}


resizeHeartCanvas();


window.addEventListener(
    "resize",
    resizeHeartCanvas
);


/* =========================
   معادلة القلب
========================= */

function heartXY(t) {

    const x =
        16 *
        Math.pow(
            Math.sin(t),
            3
        );


    const y =
        13 *
            Math.cos(t)

        - 5 *
            Math.cos(2 * t)

        - 2 *
            Math.cos(3 * t)

        - Math.cos(4 * t);


    return {

        x: x,

        y: -y

    };

}


/* =========================
   تحويل القلب للشاشة
========================= */

function toScreen(x, y) {

    const scale =
        Math.min(

            SCALE,

            Math.min(

                window.innerWidth / 45,

                window.innerHeight / 35

            )

        );


    return {

        x:
            x * scale +
            window.innerWidth / 2,

        y:
            y * scale +
            window.innerHeight / 2

    };

}


/* =========================
   إنشاء Particle
========================= */

function createParticle(
    x,
    y,
    order,
    kind
) {

    const color =
        COLORS[
            Math.floor(
                Math.random() *
                COLORS.length
            )
        ];


    particles.push({

        x: x,

        y: y,

        order: order,

        kind: kind,

        word:
            WORDS[
                Math.floor(
                    Math.random() *
                    WORDS.length
                )
            ],

        color: color,

        alpha: 0,

        flicker:
            Math.random() *
            Math.PI *
            2,

        sizeMult:
            0.85 +
            Math.random() *
            0.30,

        delay: 0

    });

}


/* =========================
   قلب من الخارج
========================= */

function buildOutlineParticles() {

    const nOutline = 160;

    const minGap = 30;

    const placed = [];


    for (
        let i = 0;
        i < nOutline;
        i++
    ) {

        const t =
            (i / nOutline) *
            Math.PI *
            2;


        const point =
            heartXY(t);


        const screen =
            toScreen(
                point.x,
                point.y
            );


        let tooClose =
            false;


        for (const p of placed) {

            if (

                Math.hypot(

                    screen.x - p.x,

                    screen.y - p.y

                ) < minGap

            ) {

                tooClose = true;

                break;

            }

        }


        if (!tooClose) {

            placed.push(screen);


            createParticle(

                screen.x,

                screen.y,

                i,

                "outline"

            );

        }

    }

}


/* =========================
   ملء القلب
========================= */

function buildFillParticles() {

    const nFill = 130;

    const minGap = 46;

    const placed = [];

    let attempts = 0;

    const maxAttempts =
        nFill * 80;


    while (

        placed.length < nFill &&

        attempts < maxAttempts

    ) {

        attempts++;


        const t =
            Math.random() *
            Math.PI *
            2;


        const r =
            Math.random() *
            0.86;


        const point =
            heartXY(t);


        const screen =
            toScreen(

                point.x * r,

                point.y * r

            );


        let tooClose =
            false;


        for (const p of placed) {

            if (

                Math.hypot(

                    screen.x - p.x,

                    screen.y - p.y

                ) < minGap

            ) {

                tooClose = true;

                break;

            }

        }


        if (!tooClose) {

            placed.push(screen);


            createParticle(

                screen.x,

                screen.y,

                Math.floor(
                    Math.random() * 321
                ),

                "fill"

            );

        }

    }

}


/* =========================
   تجهيز القلب
========================= */

function buildHeart() {

    particles = [];


    buildOutlineParticles();


    const outlineParticles =
        particles.filter(
            p =>
                p.kind === "outline"
        );


    const fillStartFrame =
        Math.max(

            ...outlineParticles.map(
                p => p.order
            )

        ) * 1.6 + 30;


    buildFillParticles();


    for (const p of particles) {

        if (
            p.kind === "outline"
        ) {

            p.delay =
                p.order * 1.6;

        } else {

            p.delay =
                fillStartFrame +
                p.order;

        }

    }

}


/* =========================
   رسم Particle
========================= */

function drawParticle(
    p,
    frame
) {

    if (p.alpha <= 0)
        return;


    let flick = 1;


    if (p.alpha >= 255) {

        flick =
            0.75 +
            0.25 *
            Math.sin(

                frame * 0.04 +
                p.flicker

            );

    }


    const alpha =
        Math.floor(
            p.alpha * flick
        );


    if (alpha <= 0)
        return;


    const size =
        Math.floor(
            17 *
            p.sizeMult
        );


    const color =
        `rgb(
            ${p.color[0]},
            ${p.color[1]},
            ${p.color[2]}
        )`;


    ctx.save();


    ctx.font =
        `bold ${size}px Arial`;


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.globalAlpha =
        alpha / 255;


    ctx.shadowColor =
        color;


    ctx.shadowBlur = 18;


    ctx.fillStyle =
        color;


    ctx.fillText(
        p.word,
        p.x,
        p.y
    );


    ctx.restore();

}


/* =========================
   Love You في المنتصف
========================= */

function drawCenterText(frame) {

    const fillParticles =
        particles.filter(
            p =>
                p.kind === "fill"
        );


    if (!fillParticles.length)
        return;


    const fillStart =
        Math.max(

            ...particles
                .filter(
                    p =>
                        p.kind ===
                        "outline"
                )
                .map(
                    p =>
                        p.order
                )

        ) * 1.6 + 30;


    const centerStart =
        fillStart + 200;


    if (frame <= centerStart)
        return;


    const progress =
        Math.min(

            1,

            (frame - centerStart) /
            60

        );


    const centerAlpha =
        Math.floor(

            255 *

            (

                1 -

                Math.exp(
                    -progress * 8
                )

            )

        );


    const pulse =
        1 +

        0.025 *

        Math.sin(
            frame * 0.05
        );


    const baseSize = 54;


    const fontSize =
        Math.floor(
            baseSize * pulse
        );


    ctx.save();


    ctx.font =
        `bold ${fontSize}px Georgia`;


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.globalAlpha =
        centerAlpha / 255;


    ctx.shadowColor =
        "rgba(255,255,255,0.7)";


    ctx.shadowBlur = 25;


    ctx.fillStyle =
        "rgb(255,250,245)";


    ctx.fillText(

        "Love You",

        heartCanvas.width / 2,

        heartCanvas.height / 2

    );


    ctx.restore();

}


/* =========================
   Animation
========================= */

function animateHeart(
    startTime
) {

    const elapsed =
        performance.now() -
        startTime;


    const frame =
        elapsed / 16.6667;


    ctx.clearRect(

        0,

        0,

        heartCanvas.width,

        heartCanvas.height

    );


    for (const p of particles) {

        if (

            frame > p.delay &&

            p.alpha < 255

        ) {

            p.alpha =
                Math.min(

                    255,

                    p.alpha +

                    14 +

                    Math.floor(
                        Math.random() * 5
                    )

                );

        }


        drawParticle(
            p,
            frame
        );

    }


    drawCenterText(frame);


    requestAnimationFrame(

        () =>
            animateHeart(
                startTime
            )

    );

}


/* =========================
   تشغيل مشهد القلب
========================= */

function showHeart() {

    if (animationStarted)
        return;


    animationStarted =
        true;


    heartScene.classList.add(
        "show"
    );


    buildHeart();


    /*
       تشغيل الموسيقى
    */

    if (loveMusic.paused) {
        startHeartMusic();
    }


    /*
       تشغيل القلب
    */

    requestAnimationFrame(

        () =>
            animateHeart(
                performance.now()
            )

    );

}
