let deferredPrompt;

const popup = document.getElementById("installPopup");
const installBtn = document.getElementById("installNow");
const closeBtn = document.getElementById("closePopup");

// यदि पहले से Install है तो कुछ मत दिखाओ
if (
    window.matchMedia("(display-mode: standalone)").matches ||
    localStorage.getItem("pwaInstalled") === "true"
) {

    if (popup) popup.remove();

}

// Chrome Install Event
window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    // यदि User ने पहले Later दबाया है
    const hideUntil = localStorage.getItem("hideInstallPopupUntil");

    if (hideUntil && Date.now() < Number(hideUntil)) {
        return;
    }

    setTimeout(() => {

        if (popup) {

            popup.style.display = "block";

        }

    }, 5000);

});

// Install Button
if (installBtn) {

    installBtn.onclick = async () => {

        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {

            localStorage.setItem("pwaInstalled", "true");

        }

        popup.style.display = "none";

        deferredPrompt = null;

    };

}

// Later Button
if (closeBtn) {

    closeBtn.onclick = () => {

        popup.style.display = "none";

        // 7 दिन तक दोबारा नहीं दिखेगा
        const sevenDays = Date.now() + 7 * 24 * 60 * 60 * 1000;

        localStorage.setItem(
            "hideInstallPopupUntil",
            sevenDays
        );

    };

}

// Install होने के बाद
window.addEventListener("appinstalled", () => {

    localStorage.setItem("pwaInstalled", "true");

    if (popup) popup.remove();

});
