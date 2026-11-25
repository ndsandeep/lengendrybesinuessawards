import React, { useEffect, useState } from "react";
import { prefersReducedMotion } from "../../hooks/useScroll.js";

const CURTAIN_OPEN_DELAY_MS = 1050;

/**
 * Velvet stage curtains that part on page load, then get out of the way.
 * Click anywhere to skip. Not shown for reduced-motion users.
 */
export function Curtain() {
  const [stage, setStage] = useState(() => (prefersReducedMotion() ? "gone" : "closed"));

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const unlockScroll = () => {
      root.classList.remove("has-curtain");
      body.classList.remove("has-curtain");
    };

    if (stage === "gone") {
      unlockScroll();
      return;
    }

    root.classList.add("has-curtain");
    document.body.classList.add("has-curtain");
    if (stage !== "closed") return unlockScroll;
    const open = setTimeout(() => setStage("open"), CURTAIN_OPEN_DELAY_MS);
    return () => {
      clearTimeout(open);
      unlockScroll();
    };
  }, [stage]);

  if (stage === "gone") return null;

  return (
    <div
      className={`curtain curtain--${stage}`}
      onClick={() => setStage("open")}
      onAnimationEnd={event => {
        if (event.target === event.currentTarget && event.animationName === "curtain-fade") {
          setStage("gone");
        }
      }}
      aria-hidden="true"
    >
      <div className="curtain-half curtain-half--left" />
      <div className="curtain-half curtain-half--right" />
      <div className="curtain-valance" />
      <div className="curtain-announce">
        <p>Ladies and gentlemen, welcome to</p>
        <strong>The Legendary Business Awards</strong>
      </div>
    </div>
  );
}

/** Gold confetti burst from a point on screen (defaults to top centre). */
export function confetti({ x = window.innerWidth / 2, y = window.innerHeight * 0.25, count = 150 } = {}) {
  if (prefersReducedMotion()) return;
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const colors = ["#ffd98a", "#e7b54b", "#ff8a4c", "#ff5b1f", "#fff4dc"];
  const pieces = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  });

  const start = performance.now();
  const frame = now => {
    const t = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
      p.vy += 0.28;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - t / 3200);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.scale(1, Math.cos(p.r * 2));
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (t < 3200) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
