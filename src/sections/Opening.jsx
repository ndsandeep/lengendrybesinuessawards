import React, { useEffect, useRef } from "react";
import { EVENT, ribbonA, ribbonB } from "../data/siteData.js";
import { Countdown, Embers, Marquee, CountUp, Reveal } from "../components/ui/index.jsx";
import { useScrollProgress, prefersReducedMotion } from "../hooks/useScroll.js";

/** Shrinks the giant headline so "LEGENDARY ’26" always fits on one line. */
function useFitTitle(ref, max) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const fit = () => {
      const available = node.parentElement.clientWidth;
      const base = Math.min(max, window.innerWidth * 0.22);
      node.style.fontSize = `${base}px`;
      const natural = node.scrollWidth;
      if (natural > available) {
        node.style.fontSize = `${Math.floor(base * (available / natural) * 0.995)}px`;
      }
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [ref, max]);
}

/**
 * A stage spotlight that follows the pointer across the hero.
 * With no pointer (touch, idle), it drifts slowly around the trophy on its own.
 */
function useSpotlight(ref) {
  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    let frame = 0;
    let visible = true;
    let lastMove = -Infinity;
    const pos = { x: 0.72, y: 0.42 };
    const target = { x: 0.72, y: 0.42 };

    const onMove = event => {
      const rect = node.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = (event.clientY - rect.top) / rect.height;
      lastMove = performance.now();
    };

    const tick = now => {
      if (now - lastMove > 2500) {
        const t = now / 2600;
        target.x = 0.66 + Math.sin(t) * 0.16;
        target.y = 0.45 + Math.sin(t * 2) * 0.12;
      }
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      node.style.setProperty("--sx", `${(pos.x * 100).toFixed(2)}%`);
      node.style.setProperty("--sy", `${(pos.y * 100).toFixed(2)}%`);
      if (visible) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(tick);
    });
    observer.observe(node);
    node.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      node.removeEventListener("pointermove", onMove);
    };
  }, [ref]);
}

export function Hero({ onRegister, onEnquire }) {
  const titleRef = useRef(null);
  const heroRef = useRef(null);
  useFitTitle(titleRef, 300);
  useSpotlight(heroRef);
  const meta = [EVENT.dateLabel, EVENT.time, `${EVENT.venue}, ${EVENT.city}`];
  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero-glow" aria-hidden="true" />
      <Embers />
      <img className="hero-trophy" src="/assets/Images/golden-trophy.png" alt="" aria-hidden="true" />
      <div className="hero-spot" aria-hidden="true" />

      <div className="hero-inner">
        <ul className="hero-meta" aria-label="Event details">
          {meta.map(item => (
            <li key={item}>{item}</li>
          ))}
          <li className="is-live">Nominations open</li>
        </ul>

        <h1
          className="hero-title"
          aria-label="Legendary 2026"
          ref={titleRef}
        >
          <span className="hero-word">
            {"LEGENDARY".split("").map((letter, i) => (
              <span key={i} style={{ "--i": i }}>{letter}</span>
            ))}
          </span>
          <span className="hero-year">’26</span>
        </h1>

        <div className="hero-bottom">
          <div className="hero-copy">
            <p className="hero-sub">Hyderabad’s Business Awards Night</p>
            <p className="hero-presenter">Presented by PR Agencies &amp; Sindu Advertisers</p>
            <p className="hero-lede">
              One evening at {EVENT.venue} honouring entrepreneurs, business leaders and professionals
              across 15 fields, for the impact they have made in business and society.
            </p>
            <div className="hero-actions">
              <button className="btn btn--solid" onClick={onRegister}>Submit a nomination</button>
              <button className="btn btn--ghost" onClick={onEnquire}>Send an enquiry</button>
            </div>
          </div>
          <div className="hero-clock">
            <Countdown target={EVENT.date} variant="hero" units={["days", "hours", "minutes"]} />
            <p>until the curtain rises</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Two crossed, tilted tickers between hero and theme. */
export function Ribbons() {
  return (
    <section className="ribbons" aria-label="Highlights">
      <Marquee
        className="ribbon ribbon--accent"
        items={ribbonA}
        speed={36}
        render={(item, i) => (
          <>
            <span className={i % 2 ? "r-serif" : "r-caps"}>{item}</span>
            <span className="r-star" aria-hidden="true">✦</span>
          </>
        )}
      />
      <Marquee
        className="ribbon ribbon--paper"
        items={ribbonB}
        speed={60}
        reverse
        render={(item, i) => (
          <>
            <span className={i % 2 ? "r-serif" : "r-caps"}>{item}</span>
            <span className="r-dot" aria-hidden="true">·</span>
          </>
        )}
      />
    </section>
  );
}

/** Outline headline that fills line by line as you scroll. */
function FillLine({ text, progress }) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <span className="fill-line">
      <span className="fill-outline" aria-hidden="true">{text}</span>
      <span className="fill-solid" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>{text}</span>
    </span>
  );
}

export function Theme() {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  // Map section progress to each line filling one after another.
  const line = index => (p - 0.12 - index * 0.09) / 0.14;
  const lines = ["ONE NIGHT.", "ONE STAGE.", "LASTING", "LEGACY."];

  return (
    <section className="theme section" ref={ref} aria-labelledby="theme-title">
      <div className="wrap">
        <p className="kicker">The promise for 2026</p>
        <h2 className="display display--xl" id="theme-title" aria-label="One night. One stage. Lasting legacy.">
          {lines.map((text, i) => (
            <FillLine key={text} text={text} progress={line(i)} />
          ))}
        </h2>

        <Reveal as="p" className="statement">
          Most achievements happen quietly, in offices, on shop floors and in classrooms.{" "}
          <em>This is the night they are said out loud</em>, on a stage, in front of the people who matter.
        </Reveal>

        <dl className="stats">
          {[
            [300, "+", "Invited guests"],
            [15, "", "Recognition fields"],
            [8, "", "Communities in the room"],
            [1, "", "Night to remember"]
          ].map(([value, suffix, label]) => (
            <div className="stat" key={label}>
              <dt><CountUp value={value} suffix={suffix} /></dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
