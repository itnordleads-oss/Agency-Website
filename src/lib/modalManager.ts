/** Lightweight modal coordination for app UI overlays (menus, FAB gating). */
const MODAL_OPEN_EVENT = "adealforge:modal-open";
const MODAL_CLOSE_EVENT = "adealforge:modal-close";

export type AppModalName = "mobileMenu" | "consentModal" | "preferencesModal";

let scrollLockCount = 0;

export function emitModalOpen(modalName: AppModalName) {
  window.dispatchEvent(new CustomEvent(MODAL_OPEN_EVENT, { detail: { modalName } }));
}

export function emitModalClose(modalName: AppModalName) {
  window.dispatchEvent(new CustomEvent(MODAL_CLOSE_EVENT, { detail: { modalName } }));
}

export function onModalOpen(handler: (modalName: AppModalName) => void) {
  const listener = (event: Event) => {
    const custom = event as CustomEvent<{ modalName?: AppModalName }>;
    if (custom.detail?.modalName) {
      handler(custom.detail.modalName);
    }
  };
  window.addEventListener(MODAL_OPEN_EVENT, listener);
  return () => window.removeEventListener(MODAL_OPEN_EVENT, listener);
}

export function onModalClose(handler: (modalName: AppModalName) => void) {
  const listener = (event: Event) => {
    const custom = event as CustomEvent<{ modalName?: AppModalName }>;
    if (custom.detail?.modalName) {
      handler(custom.detail.modalName);
    }
  };
  window.addEventListener(MODAL_CLOSE_EVENT, listener);
  return () => window.removeEventListener(MODAL_CLOSE_EVENT, listener);
}

export function lockBodyScroll() {
  const { body, documentElement } = document;
  scrollLockCount += 1;

  if (body.dataset.scrollLocked === "true") {
    return;
  }

  const scrollY = window.scrollY;
  body.dataset.scrollLocked = "true";
  body.dataset.scrollY = String(scrollY);
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  documentElement.classList.add("adealforge-scroll-lock");
}

export function unlockBodyScroll() {
  const { body, documentElement } = document;
  scrollLockCount = Math.max(0, scrollLockCount - 1);

  if (scrollLockCount > 0) {
    return;
  }

  if (body.dataset.scrollLocked !== "true") {
    return;
  }

  const scrollY = Number(body.dataset.scrollY || "0");
  body.dataset.scrollLocked = "false";
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  delete body.dataset.scrollY;
  documentElement.classList.remove("adealforge-scroll-lock");
  window.scrollTo(0, scrollY);
}

/** Force-clear scroll lock (e.g. after cookie consent fully dismissed). */
export function resetBodyScrollLock() {
  scrollLockCount = 0;
  const { body, documentElement } = document;
  if (body.dataset.scrollLocked !== "true") {
    return;
  }
  const scrollY = Number(body.dataset.scrollY || "0");
  body.dataset.scrollLocked = "false";
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  delete body.dataset.scrollY;
  documentElement.classList.remove("adealforge-scroll-lock");
  window.scrollTo(0, scrollY);
}
