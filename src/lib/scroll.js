import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis = null;
let locks = 0;

// Smooth scrolling for the whole page; skipped entirely for reduced-motion users.
export function initSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
  let raf = requestAnimationFrame(function loop(time) {
    lenis.raf(time);
    raf = requestAnimationFrame(loop);
  });

  // Route every in-page anchor through Lenis, including ones rendered later
  const onClick = (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const id = link.getAttribute("href").slice(1);
    if (!id) return;
    e.preventDefault();
    scrollToId(id);
  };
  document.addEventListener("click", onClick);

  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("click", onClick);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToId(id) {
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  // force: the mobile menu may still hold the scroll lock while this click resolves
  if (lenis) lenis.scrollTo(target, { duration: 1.4, force: true });
  else if (target === 0) window.scrollTo({ top: 0 });
  else target.scrollIntoView();
}

// Reference-counted so a modal opened from the mobile menu can't unlock early.
export function lockScroll() {
  if (locks++ > 0) return;
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  if (--locks > 0) return;
  locks = 0;
  lenis?.start();
  document.documentElement.style.overflow = "";
}
