export function getWindowScrollTop() {
  if (typeof window === "undefined") return 0;
  return window.scrollY || window.pageYOffset || 0;
}

export function shouldShowFloatingScrollTopButton() {
  return getWindowScrollTop() > 0;
}

export function scrollWindowToTop(behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") return;
  window.scrollTo({
    top: 0,
    behavior,
  });
}
