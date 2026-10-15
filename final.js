/* =========================
   تحميل صور الصفحات اللي مش صفحات قصة
========================= */

function loadAssetsIn(pageId) {

    const page = document.getElementById(pageId);

    page.querySelectorAll("img[data-n]").forEach(img => {
        if (!img.getAttribute("src")) {
            loadAsset(img, `images/${img.dataset.n}`, IMG_EXTS, img.dataset.n, 300, 400);
        }
    });

    page.querySelectorAll("img[data-s]").forEach(img => {
        if (!img.getAttribute("src")) {
            loadAsset(img, `images/S${img.dataset.s}`, STICKER_EXTS, "S" + img.dataset.s, 200, 200);
        }
    });
}

pageHooks["page-teaser"] = () => loadAssetsIn("page-teaser");
pageHooks["page-story3"] = () => loadAssetsIn("page-story3");
pageHooks["page-final"] = () => { initStory("page-final"); setupFinalMessageAutoScroll(); };


/* =========================
   صفحة الفلاش باك
========================= */

let videoPageStarted = false;

function startVideoPage() {

    loadAssetsIn("page-video");

    if (videoPageStarted) return;
    videoPageStarted = true;

    const video = document.getElementById("flashVideo");

    let revealed = false;

    function reveal() {
        if (revealed) return;
        revealed = true;
        showBlock("streakBox");
    }

    video.addEventListener("ended", reveal);
    video.addEventListener("error", reveal);

    video.play().catch(() => { });

    // لو الفيديو ماشتغلش لأي سبب، الاستبيان يظهر برضو
    setTimeout(reveal, 40000);
}

pageHooks["page-video"] = startVideoPage;


/* =========================
   الاستبيانات + العد التنازلي + اللعبة
========================= */

function disableButtons(boxId) {
    document.querySelectorAll("#" + boxId + " button").forEach(b => {
        b.disabled = true;
    });
}

function answerStreak() {

    disableButtons("streakBox");

    showBlock("img17Box");

    setTimeout(() => showBlock("guessBox"), 1500);
}

function answerGuess() {

    disableButtons("guessBox");

    // Start audio during the user's tap so mobile browsers allow playback.
    startHeartMusic(true);

    showBlock("img18Box");

    let n = 5;

    const el = document.getElementById("countdown");

    el.textContent = n;

    const timer = setInterval(() => {

        n--;

        el.textContent = n > 0 ? n : "😎";

        if (n <= 0) {
            clearInterval(timer);
            setTimeout(startHeartGame, 600);
        }

    }, 1000);
}

function startHeartGame() {

    showHeart();

    // زر "اخر حاجة" يظهر بعد ما القلب يخلص
    setTimeout(() => {
        document.getElementById("lastWrap").classList.add("visible");
    }, 14000);
}

function goFinal() {

    document.getElementById("heartScene").classList.remove("show");

    goTo("page-final");
}

function startHeartMusic(restart = false) {
    if (!loveMusic) return;

    if (restart) loveMusic.currentTime = 0;

    const retryButton = document.getElementById("musicRetry");
    const playback = loveMusic.play();

    if (playback && typeof playback.then === "function") {
        playback
            .then(() => {
                if (retryButton) retryButton.hidden = true;
            })
            .catch((error) => {
                console.warn("Music playback needs a tap:", error);
                if (retryButton) retryButton.hidden = false;
            });
    }
}

function retryHeartMusic() {
    startHeartMusic(true);
}


/* =========================
   الظرف: فتح باقي الصفحات
========================= */

function openEnvelope() {

    const env = document.getElementById("envelope");

    if (env.classList.contains("opened")) return;

    env.classList.add("opened");

    document.getElementById("envHint").style.opacity = 0;

    const rest = document.getElementById("bookRest");

    rest.classList.add("shown");

    requestAnimationFrame(() => requestAnimationFrame(() => {

        rest.classList.add("visible");

        // نعيد حساب الأسهم بعد ما الصفحات ظهرت
        if (storyState["page-final"]) {
            storyState["page-final"].rebuild();
        }

        setTimeout(() => {
            rest.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 450);
    }));
}

/* After the last photo has been read, bring the message card into view. */
let finalMessageObserver = null;
let finalMessageTimer = null;
let finalMessageAutoScrolled = false;

function setupFinalMessageAutoScroll() {
    const page = document.getElementById("page-final");
    const lastRow = document.getElementById("book5Row");
    const formPanel = document.getElementById("messageFormPanel");
    if (!page || !lastRow || !formPanel || finalMessageAutoScrolled) return;

    if (finalMessageObserver) finalMessageObserver.disconnect();
    finalMessageObserver = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (finalMessageAutoScrolled) return;
        clearTimeout(finalMessageTimer);
        if (!entry.isIntersecting || !page.classList.contains("active")) return;

        finalMessageTimer = setTimeout(() => {
            if (!page.classList.contains("active")) return;
            formPanel.hidden = false;
            storyState["page-final"]?.rebuild();
            finalMessageAutoScrolled = true;
            formPanel.scrollIntoView({ behavior: "smooth", block: "center" });
            finalMessageObserver?.disconnect();
            finalMessageObserver = null;
        }, 5000);
    }, { root: page, threshold: 0.35 });

    finalMessageObserver.observe(lastRow);
}