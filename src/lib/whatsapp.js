let listeningForReturn = false;
let leftPageForWhatsApp = false;

function finishReturn() {
  if (!leftPageForWhatsApp || document.visibilityState === "hidden") return;

  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("focus", finishReturn);
  listeningForReturn = false;
  leftPageForWhatsApp = false;
  window.location.reload();
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    leftPageForWhatsApp = true;
    return;
  }
  finishReturn();
}

export function openWhatsAppAndRefreshOnReturn(url) {
  if (!listeningForReturn) {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", finishReturn);
    listeningForReturn = true;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
