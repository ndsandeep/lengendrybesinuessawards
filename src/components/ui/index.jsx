import React, { useEffect, useRef, useState } from "react";
import { useCountdown, useInView, pad, prefersReducedMotion } from "../../hooks/useScroll.js";

/** Italic serif kicker + condensed headline, the core heading pattern. */
export function Heading({ kicker, children, as: Tag = "h2", className = "" }) {
  return (
    <header className={`heading ${className}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      <Tag className="display">{children}</Tag>
    </header>
  );
}

/** Adds .is-in once the element scrolls into view; CSS handles the motion. */
export function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.15 });
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ "--delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Countdown blocks. variant: "hero" | "card" | "bar" */
export function Countdown({ target, variant = "card", units = ["days", "hours", "minutes", "seconds"] }) {
  const time = useCountdown(target);
  const labels = { days: "Days", hours: "Hours", minutes: "Mins", seconds: "Secs" };
  return (
    <div className={`countdown countdown--${variant}`} role="timer" aria-label="Time until the awards night">
      {units.map((unit, i) => (
        <React.Fragment key={unit}>
          {variant === "bar" && i > 0 && <span className="countdown-colon" aria-hidden="true">:</span>}
          <div className="countdown-unit">
            <strong>{pad(time[unit])}</strong>
            {variant !== "bar" && <span>{labels[unit]}</span>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/** Infinite horizontal ticker. */
export function Marquee({ items, className = "", reverse = false, speed = 40, render }) {
  const list = [...items, ...items];
  return (
    <div className={`marquee ${className}`}>
      <div
        className={`marquee-track ${reverse ? "is-reverse" : ""}`}
        style={{ "--speed": `${speed}s` }}
      >
        {list.map((item, i) => (
          <span className="marquee-item" key={i} aria-hidden={i >= items.length}>
            {render ? render(item, i) : item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Counts up from 0 when scrolled into view. */
export function CountUp({ value, suffix = "", duration = 2800 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.6 });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setShown(value);
      return;
    }
    let frame;
    const start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / duration);
      // Realistic ease: fast start, slow finish (easeOutExpo)
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setShown(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="countup">
      {shown}
      {suffix && <em>{suffix}</em>}
    </span>
  );
}

/** Rising gold embers behind the hero. Pauses off-screen; off for reduced motion. */
export function Embers({ count = 70 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = initial => ({
      x: width * (0.35 + Math.random() * 0.65),
      y: initial ? Math.random() * height : height + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.25 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.35,
      life: Math.random(),
      hue: Math.random() < 0.6 ? "255,140,60" : "255,206,110"
    });
    const parts = Array.from({ length: count }, () => spawn(true));

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of parts) {
        p.y -= p.vy;
        p.x += p.vx + Math.sin((p.y + p.life * 100) / 40) * 0.2;
        p.life += 0.004;
        if (p.y < -10) Object.assign(p, spawn(false));
        const alpha = Math.max(0, Math.min(1, p.y / height)) * (0.55 + 0.45 * Math.sin(p.life * 12));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.hue},${alpha})`;
        ctx.shadowColor = `rgba(${p.hue},0.9)`;
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) {
        cancelAnimationFrame(frame);
        draw();
      }
    });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="embers" aria-hidden="true" />;
}
