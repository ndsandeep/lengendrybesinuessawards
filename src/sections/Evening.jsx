import React, { useEffect, useRef, useState } from "react";
import { evening, eventProgram, eventReasons } from "../data/siteData.js";
import { useScrollProgress } from "../hooks/useScroll.js";
import { Heading, Reveal } from "../components/ui/index.jsx";

function CarpetArt() {
  return (
    <svg viewBox="0 0 320 240" className="art art--carpet" aria-hidden="true">
      <polygon points="130,40 190,40 300,236 20,236" className="art-carpet" />
      <line x1="160" y1="40" x2="160" y2="236" className="art-dash" />
      {[0, 1, 2, 3].map(i => (
        <g key={i} className="art-post" style={{ "--i": i }}>
          <rect x={112 - i * 26} y={70 + i * 42} width="6" height={22 + i * 8} rx="2" />
          <rect x={202 + i * 26} y={70 + i * 42} width="6" height={22 + i * 8} rx="2" />
          <circle cx={115 - i * 26} cy={68 + i * 42} r={4 + i} />
          <circle cx={205 + i * 26} cy={68 + i * 42} r={4 + i} />
        </g>
      ))}
      <path d="M118 92 Q160 110 202 92" className="art-rope" />
      <path d="M92 138 Q160 162 228 138" className="art-rope" />
      <path d="M66 182 Q160 214 254 182" className="art-rope" />
    </svg>
  );
}

function TrophyArt() {
  return (
    <svg viewBox="0 0 320 240" className="art art--trophy" aria-hidden="true">
      <polygon points="160,0 70,236 250,236" className="art-beam" />
      <rect x="100" y="196" width="120" height="40" rx="4" className="art-podium" />
      <rect x="130" y="176" width="60" height="22" rx="3" className="art-podium art-podium--top" />
      <path
        d="M128 70 h64 v18 c0 30 -14 48 -32 52 c-18 -4 -32 -22 -32 -52 z M128 80 c-20 0 -22 30 2 32 M192 80 c20 0 22 30 -2 32"
        className="art-cup"
      />
      <rect x="154" y="140" width="12" height="22" className="art-cup-fill" />
      <rect x="140" y="160" width="40" height="12" rx="2" className="art-cup-fill" />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <circle
          key={i}
          cx={110 + i * 20}
          cy={40 + (i % 3) * 18}
          r="2.5"
          className="art-spark"
          style={{ "--i": i }}
        />
      ))}
    </svg>
  );
}

function NetworkArt() {
  const nodes = [
    [160, 120, 14], [80, 70, 9], [240, 64, 10], [64, 170, 8], [256, 176, 9],
    [160, 32, 7], [160, 212, 8], [112, 128, 6], [212, 124, 6]
  ];
  const links = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 5], [2, 5], [3, 6], [4, 6], [1, 7], [2, 8], [7, 3], [8, 4]];
  return (
    <svg viewBox="0 0 320 240" className="art art--network" aria-hidden="true">
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          className="art-link"
          style={{ "--i": i }}
        />
      ))}
      {nodes.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} className={i === 0 ? "art-node art-node--hub" : "art-node"} style={{ "--i": i }} />
      ))}
    </svg>
  );
}

const arts = { carpet: CarpetArt, trophy: TrophyArt, network: NetworkArt };

export function Evening() {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const progress = useScrollProgress(outerRef, "pinned");
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const active = Math.min(evening.length - 1, Math.floor(progress * evening.length * 0.999 + 0.0001));

  return (
    <section className="evening" id="evening" ref={outerRef} aria-labelledby="evening-title">
      <div className="evening-sticky">
        <div className="evening-head wrap">
          <p className="kicker">One evening, three movements</p>
          <h2 className="display" id="evening-title">
            Arrive. Rise.
            <br />
            Connect.
          </h2>
          <ol className="evening-dots" aria-hidden="true">
            {evening.map((item, i) => (
              <li key={item.word} className={i <= active ? "is-on" : ""} />
            ))}
          </ol>
        </div>

        <div
          className="evening-track"
          ref={trackRef}
          style={{ transform: `translate3d(${-progress * distance}px,0,0)` }}
        >
          {evening.map((item, i) => {
            const Art = arts[item.art];
            return (
              <article className={`move ${i === active ? "is-active" : ""}`} key={item.word}>
                <div className="move-art">
                  <Art />
                </div>
                <div className="move-copy">
                  <p className="kicker">{item.kicker}</p>
                  <h3 className="move-word">
                    <span className="move-num">{String(i + 1).padStart(2, "0")}</span>
                    {item.word}
                  </h3>
                  <p>{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function EventFlow() {
  return (
    <section className="event-flow section" id="event-flow" aria-labelledby="event-flow-title">
      <div className="wrap">
        <div className="event-flow-heading">
          <Heading kicker="The evening’s programme">
            <span id="event-flow-title">A night to remember</span>
          </Heading>
          <p className="lede">From the opening lamp-lighting to the final walk on stage.</p>
        </div>

        <ol className="program-timeline">
          {eventProgram.map((item, index) => (
            <Reveal as="li" className="program-item" key={`${item.title}-${index}`} delay={(index % 3) * 70}>
              <span className="program-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhyEvent() {
  return (
    <section className="why-event section" id="why-event" aria-labelledby="why-event-title">
      <div className="wrap">
        <div className="why-event-heading">
          <Heading kicker="More than an awards night">
            <span id="why-event-title">Why this event</span>
          </Heading>
          <p className="lede">
            Created by PR Agencies and Sindu Advertisers to bring people, ideas and ambition together.
          </p>
        </div>

        <div className="why-event-grid">
          {eventReasons.map(reason => (
            <Reveal as="article" className="why-event-card" key={reason.number}>
              <span className="why-event-number">{reason.number}</span>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
