type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const PWA_INSTALL_EVENT = "taqbot:pwa-install-ready";

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function registerPwa() {
  if (typeof window === "undefined") return;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent(PWA_INSTALL_EVENT));
  });

  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener("statechange", () => {
            if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent("taqbot:pwa-update-ready"));
            }
          });
        });
      })
      .catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
  });
}

export async function promptPwaInstall() {
  if (!deferredPrompt) return false;

  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  await promptEvent.prompt();
  const choice = await promptEvent.userChoice;
  return choice.outcome === "accepted";
}

export function onPwaInstallReady(callback: () => void) {
  window.addEventListener(PWA_INSTALL_EVENT, callback);
  return () => window.removeEventListener(PWA_INSTALL_EVENT, callback);
}