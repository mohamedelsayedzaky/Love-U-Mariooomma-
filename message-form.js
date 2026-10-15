(() => {
    const form = document.getElementById("messageForm");
    if (!form) return;

    const endpoint = "https://script.google.com/macros/s/AKfycbxJMa-STUjW11e1YysfgScdqajnam-8TM-lPZ5vXfw0zN6mtyDt7IecHnPOs2_cRc8u/exec";
    const message = document.getElementById("messageText");
    const button = document.getElementById("messageFormSubmit");
    const status = document.getElementById("messageFormStatus");
    const frame = document.getElementById("messageSubmitFrame");

    const endpointReady = endpoint.startsWith("https://script.google.com/macros/s/") &&
        endpoint.endsWith("/exec");

    if (endpointReady) {
        form.action = endpoint;
        button.disabled = false;
        status.textContent = "اكتبي رسالتك لحموكشه 🫶🏻";
    } else {
        status.textContent = "الخانة جاهزة؛ باقي ربطها برابط Google مرة واحدة.";
    }

    function burstMessageHearts() {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const heart = document.createElement("span");
            const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
            const distance = 34 + Math.random() * 32;
            heart.className = "floating-sticker-heart";
            heart.textContent = i % 2 ? "♥" : "💖";
            heart.style.left = centerX + "px";
            heart.style.top = centerY + "px";
            heart.style.setProperty("--dx", Math.cos(angle) * distance + "px");
            heart.style.setProperty("--dy", (Math.sin(angle) * distance - 12) + "px");
            document.body.append(heart);
            setTimeout(() => heart.remove(), 1150);
        }
    }

    let waitingForReply = false;
    let timeoutId = null;

    frame.addEventListener("load", () => {
        if (!waitingForReply) return;
        waitingForReply = false;
        clearTimeout(timeoutId);
        button.disabled = false;
        button.textContent = "ودي 😎";
        status.dataset.state = "success";
        status.textContent = "حموكشه بيحب مريومه 🫶🏻";
        burstMessageHearts();
        message.value = "";
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!endpointReady || button.disabled) return;

        if (!message.value.trim()) {
            status.dataset.state = "error";
            status.textContent = "اكتبي رسالتك الأول 🫶🏻";
            message.focus();
            return;
        }

        status.removeAttribute("data-state");
        status.textContent = "جاري إرسال رسالتك…";
        button.disabled = true;
        button.textContent = "جاري الإرسال…";
        waitingForReply = true;

        timeoutId = setTimeout(() => {
            if (!waitingForReply) return;
            waitingForReply = false;
            button.disabled = false;
            button.textContent = "حاولي الإرسال تاني";
            status.dataset.state = "error";
            status.textContent = "الإرسال اتأخر. اتأكدي من اتصال الإنترنت وجربي تاني.";
        }, 15000);

        HTMLFormElement.prototype.submit.call(form);
    });
})();