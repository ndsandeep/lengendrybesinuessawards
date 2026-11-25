import { useEffect, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once the element has entered the viewport (fires once). */
export function useInView(ref, { threshold = 0.2, rootMargin = "0px" } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, inView]);

  return inView;
}

/** Live boolean: is the element currently on screen. */
export function useOnScreen(ref, rootMargin = "0px") {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return visible;
}

/**
 * 0 → 1 progress of an element moving through the viewport.
 * mode "through": 0 when its top hits the bottom of the screen, 1 when its bottom leaves the top.
 * mode "pinned": 0 when its top reaches the top of the screen, 1 when its bottom reaches the bottom
 *               (use on tall wrappers with a sticky child).
 */
export function useScrollProgress(ref, mode = "through") {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      let value;
      if (mode === "pinned") {
        const distance = rect.height - vh;
        value = distance > 0 ? -rect.top / distance : 0;
      } else {
        value = (vh - rect.top) / (vh + rect.height);
      }
      setProgress(Math.min(1, Math.max(0, value)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, mode]);

  return progress;
}

/** Whole-page scroll progress, 0 → 1. */
export function usePageProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}

/** Live countdown to an ISO date string. */
export function useCountdown(target) {
  const end = new Date(target).getTime();
  const [remaining, setRemaining] = useState(() => Math.max(0, end - Date.now()));

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [end]);

  const total = Math.floor(remaining / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: remaining === 0
  };
}

export const pad = value => String(value).padStart(2, "0");

/** Smooth-scroll to a section id, accounting for the fixed header. */
export function scrollToId(id) {
  const node = document.getElementById(id);
  if (!node) return;
  const top = node.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
}
