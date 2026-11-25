import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { EVENT, navLinks, REGISTRATION_FEE } from "../../data/siteData.js";
import { usePageProgress, scrollToId } from "../../hooks/useScroll.js";
import { Countdown } from "../ui/index.jsx";

export function ScrollProgress() {
  const progress = usePageProgress();
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

export function SiteHeader({ onRegister }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
  }, [open]);

  const go = id => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <button className="brand" onClick={() => go("top")} aria-label="Back to top">
        <img src="/assets/Images/lba-2026-logo.png" alt="" width="40" height="40" />
        <span className="brand-word">
          LBA <b>’26</b>
        </span>
        <span className="brand-by">by PR Agencies &amp; Sindu Advertisers</span>
      </button>

      <nav className="site-nav" aria-label="Sections">
        {navLinks.map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={event => {
              event.preventDefault();
              go(id);
            }}
          >
            {label}
          </a>
        ))}
        <button className="btn btn--solid nav-mobile-cta" onClick={() => { setOpen(false); onRegister(); }}>
          Nominate now
        </button>
      </nav>

      <button className="btn btn--solid btn--sm header-cta" onClick={onRegister}>
        Nominate now
      </button>

      <button
        className="menu-toggle"
        onClick={() => setOpen(value => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

/** Bottom bar that stays on screen after the hero, like the reference "offer" strip. */
export function StickyBar({ hidden, onRegister }) {
  return (
    <aside className={`sticky-bar ${hidden ? "is-hidden" : ""}`} aria-label="Nomination reminder">
      <div className="sticky-bar-copy">
        <small>Nominations open</small>
        <strong>
          Nomination entry, ₹{REGISTRATION_FEE.toLocaleString("en-IN")}
        </strong>
      </div>
      <div className="sticky-bar-timer">
        <small>Starts in</small>
        <Countdown target={EVENT.date} variant="bar" units={["days", "hours", "minutes"]} />
      </div>
      <button className="btn btn--light btn--sm" onClick={onRegister}>
        Nominate
      </button>
    </aside>
  );
}

/** Dismissible countdown card on the right edge (desktop). */
export function FloatingCard({ hidden, onRegister }) {
  const [closed, setClosed] = useState(false);
  if (closed) return null;
  return (
    <aside className={`float-card ${hidden ? "is-hidden" : ""}`} aria-label="Countdown to the awards night">
      <button className="float-card-close" onClick={() => setClosed(true)} aria-label="Dismiss countdown">
        <X size={14} />
      </button>
      <p className="float-card-title">
        Seats are limited
        <span>Submit a nomination</span>
      </p>
      <Countdown target={EVENT.date} variant="card" />
      <p className="float-card-note">
        Awards night at {EVENT.venue}, {EVENT.city} on {EVENT.dateLabel}, {EVENT.time}.
      </p>
      <button className="btn btn--solid btn--sm" onClick={onRegister}>
        Nominate now
      </button>
    </aside>
  );
}
