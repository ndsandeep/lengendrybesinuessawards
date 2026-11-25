import React, { useState } from "react";
import { Plus, Minus, Play } from "lucide-react";
import { founders, fieldGroups, audiences, receipt, EVENT } from "../data/siteData.js";
import { Heading, Reveal } from "../components/ui/index.jsx";
import { TextPressure } from "../components/ui/TextPressure.jsx";

export function Founders() {
  const [open, setOpen] = useState(null);
  const [playing, setPlaying] = useState(false);

  return (
    <section className="founders section" id="about" aria-labelledby="founders-title">
      <div className="wrap">
        <div className="founders-grid">
          <div className="founders-intro">
            <Heading kicker="A note from the founders">
              <span id="founders-title">
                <TextPressure text="The people behind the legacy" />
              </span>
            </Heading>
            <Reveal as="p" className="lede">
              Legendary Business Awards is an annual recognition platform built by Sindu Advertisers and
              PR Agencies, two Hyderabad companies with decades of combined media experience. We started it
              because good work deserves a room full of people who notice.
            </Reveal>
          </div>

          <div className="founder-list">
            {founders.map((person, i) => {
              const isOpen = open === i;
              return (
                <Reveal as="article" className={`founder ${isOpen ? "is-open" : ""}`} key={person.name} delay={i * 120}>
                  <img className="founder-photo" src={person.photo} alt={person.name} loading="lazy" />
                  <div className="founder-body">
                    <h3>{person.name}</h3>
                    <p className="founder-role">{person.role}</p>
                    <div className="founder-bio" id={`bio-${i}`} hidden={!isOpen}>
                      {person.bio.map(paragraph => (
                        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                      ))}
                    </div>
                    <button
                      className="text-btn"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`bio-${i}`}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      {isOpen ? "Close profile" : "Read profile"}
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal className="story-video story-video--center" delay={140}>
          {playing ? (
            <video
              src="/videos/company-intro.mp4"
              poster="/assets/Images/charminar-thumbnail.png"
              controls
              autoPlay
              playsInline
              aria-label="Sindu Advertisers and PR Agencies company introduction"
            />
          ) : (
            <button className="story-poster" onClick={() => setPlaying(true)} aria-label="Play our story video">
              <img src="/assets/Images/charminar-thumbnail.png" alt="" />
              <span className="story-play"><Play size={22} fill="currentColor" /></span>
              <span className="story-caption">Our story in motion</span>
            </button>
          )}
        </Reveal>

        <div className="story-logos-wrap">
          <img
            className="story-logos"
            src="/assets/Images/sindu-pr-agencies-logos.png"
            alt="Sindu Advertisers and PR Agencies"
          />
        </div>
      </div>
    </section>
  );
}

/** A sealed award envelope: tap to break the seal and read the field. */
function Envelope({ index, title, line, onRegister }) {
  const [open, setOpen] = useState(false);
  const id = `env-${title.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <article className={`env ${open ? "is-open" : ""}`} style={{ "--i": index }}>
      <div className="env-letter" id={id} inert={!open}>
        <p className="env-letter-kicker">The award for</p>
        <h3>{title}</h3>
        <p>{line}</p>
        <div className="env-actions">
          <button className="btn btn--solid btn--sm" onClick={() => onRegister(title)}>
            Nominate in this field
          </button>
          <button className="text-btn" onClick={() => setOpen(false)}>Seal it</button>
        </div>
      </div>

      <button
        className="env-front"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={id}
        inert={open}
      >
        <span className="env-flap" aria-hidden="true" />
        <span className="env-seal" aria-hidden="true">LBA</span>
        <span className="env-label">And the award goes to…</span>
        <span className="env-title">{title}</span>
      </button>
    </article>
  );
}

export function Awards({ onRegister }) {
  const [tab, setTab] = useState(0);
  const group = fieldGroups[tab];

  return (
    <section className="awards section section--gold" id="awards" aria-labelledby="awards-title">
      <div className="wrap">
        <div className="awards-top">
          <div>
            <Heading kicker="The LBA ’26 awards">
              <span id="awards-title">For the ones
                <br />who lead</span>
            </Heading>
            <Reveal as="p" className="lede">
              Hyderabad has no shortage of business talent. These awards recognise the people building
              companies, institutions and communities that last, across fifteen fields.
            </Reveal>
          </div>
          <div className="coin-stage" aria-hidden="true">
            <div className="coin">
              <div className="coin-face coin-face--front">
                <img src="/assets/Images/lba-2026-logo.png" alt="" />
              </div>
              <div className="coin-face coin-face--back">
                <span>LBA</span>
                <b>’26</b>
              </div>
            </div>
            <div className="coin-shadow" />
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Award groups">
          {fieldGroups.map((g, i) => (
            <button
              key={g.name}
              role="tab"
              id={`tab-${i}`}
              aria-selected={tab === i}
              aria-controls="award-panel"
              className={tab === i ? "is-active" : ""}
              onClick={() => setTab(i)}
            >
              {g.name}
              <span>{g.fields.length}</span>
            </button>
          ))}
        </div>

        <p className="award-hint">Tap an envelope to open it.</p>

        <div className="award-grid" role="tabpanel" id="award-panel" aria-labelledby={`tab-${tab}`} key={tab}>
          {group.fields.map(([title, line], i) => (
            <Envelope key={title} index={i} title={title} line={line} onRegister={onRegister} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Audience() {
  const [active, setActive] = useState(0);
  return (
    <section className="audience section" id="audience" aria-labelledby="audience-title">
      <div className="wrap">
        <Heading kicker="Look around the room">
          <span id="audience-title">Who’s in
            <br />the room</span>
        </Heading>

        <ul className="audience-list">
          {audiences.map(([name, text], i) => (
            <li
              key={name}
              className={active === i ? "is-active" : ""}
              onMouseEnter={() => setActive(i)}
            >
              <button
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-expanded={active === i}
              >
                <span className="audience-name">{name}</span>
                <span className="audience-text">{text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Takeaway() {
  return (
    <section className="takeaway section" aria-labelledby="takeaway-title">
      <div className="wrap takeaway-grid">
        <div>
          <Heading kicker="Before you decide">
            <span id="takeaway-title">What you walk
              <br />out with</span>
          </Heading>
          <Reveal as="p" className="lede">
            No speeches that run long, no filler. An evening built around the moment your work is
            recognised, and the people you meet after.
          </Reveal>
          <ul className="checks">
            <li>Your name called on stage, in front of 300+ guests</li>
            <li>Photos and video of the moment you can use for years</li>
            <li>Coverage across TV, digital, print and radio partners</li>
          </ul>
        </div>

        <Reveal className="receipt" delay={150}>
          <div className="receipt-paper">
            <p className="receipt-head">
              LBA ’26
              <span>{EVENT.venue}, {EVENT.city}</span>
              <span>{EVENT.dateLong}</span>
            </p>
            <dl>
              {receipt.map(([item, qty]) => (
                <div key={item}>
                  <dt>{item}</dt>
                  <dd>{qty}</dd>
                </div>
              ))}
            </dl>
            <p className="receipt-total">
              <span>Total</span>
              <span>One lasting legacy</span>
            </p>
            <p className="receipt-foot">Thank you for building something worth celebrating.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
