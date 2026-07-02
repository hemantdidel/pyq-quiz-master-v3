let deferredPrompt;

const installBtn = document.getElementById("installAppBtn");

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    if (installBtn) {
        installBtn.style.display = "inline-flex";
    }

});

if (installBtn) {

    installBtn.addEventListener("click", async () => {

        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        console.log("Install:", outcome);

        deferredPrompt = null;

        installBtn.style.display = "none";

    });

}

window.addEventListener("appinstalled", () => {

    console.log("PWA Installed");

    if (installBtn) {
        installBtn.style.display = "none";
    }

});
