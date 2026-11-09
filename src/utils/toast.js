let toastTimer = null;

export function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span></span>';
    document.body.appendChild(toast);
  }
  const span = toast.querySelector("span");
  if (span) span.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

if (typeof window !== 'undefined') {
  window.BloodConnect = window.BloodConnect || {};
  window.BloodConnect.showToast = showToast;
}

