import React, { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   BlurText (React Bits)
   Staggered word-by-word blur-to-focus reveal
   ───────────────────────────────────────────── */
function BlurText({
  text = "",
  delay = 120,
  className = "",
  as: Tag = "h2",
  id,
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref} id={id} className={`blur-text ${inView ? "is-in" : ""} ${className}`}>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span
            className="blur-text-word"
            style={{ "--bt-delay": `${i * delay}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   Image Slideshow – uniform 1.5s auto-slide + 3D rotate
   ───────────────────────────────────────────── */
const VISIONARY_IMAGES = [
  "/assets/visionaries/visionary-1.jpg",
  "/assets/visionaries/visionary-2.png",
  "/assets/visionaries/visionary-3.png",
  "/assets/visionaries/visionary-4.png",
  "/assets/visionaries/visionary-5.png",
  "/assets/visionaries/visionary-6.png",
  "/assets/visionaries/visionary-7.jpg",
  "/assets/visionaries/visionary-8.jpg",
  "/assets/visionaries/visionary-9.jpg",
  "/assets/visionaries/visionary-10.jpg",
];

const SLIDE_INTERVAL_MS = 1500;

function VisionarySlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const total = VISIONARY_IMAGES.length;

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % total);
    }, SLIDE_INTERVAL_MS);
  }, [total]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const prev = () => {
    setCurrent(c => (c - 1 + total) % total);
    startTimer();
  };

  const next = () => {
    setCurrent(c => (c + 1) % total);
    startTimer();
  };

  const goTo = (index) => {
    setCurrent(index);
    startTimer();
  };

  const getSlideClass = (i) => {
    if (i === current) return "vis-slide vis-slide--active";
    const prevIdx = (current - 1 + total) % total;
    const nextIdx = (current + 1) % total;
    if (i === prevIdx) return "vis-slide vis-slide--prev";
    if (i === nextIdx) return "vis-slide vis-slide--next";
    return "vis-slide vis-slide--hidden";
  };

  return (
    <div className="vis-slider" aria-label="Visionary moments gallery" role="region">
      <div className="vis-track">
        {VISIONARY_IMAGES.map((src, i) => (
          <div key={src} className={getSlideClass(i)} aria-hidden={i !== current}>
            <div className="vis-img-wrap">
              <img
                src={src}
                alt={`LBA '26 visionary moment ${i + 1}`}
                className="vis-img"
                loading={i < 2 ? "eager" : "lazy"}
              />
              <div className="vis-img-shine" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>

      <div className="vis-dots" role="tablist" aria-label="Slide navigation">
        {VISIONARY_IMAGES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            className={`vis-dot ${i === current ? "vis-dot--active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <button className="vis-nav vis-nav--prev" onClick={prev} aria-label="Previous image">‹</button>
      <button className="vis-nav vis-nav--next" onClick={next} aria-label="Next image">›</button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main exported section
   ───────────────────────────────────────────── */
export function Visionaries() {
  return (
    <section className="visionaries section" id="visionaries" aria-labelledby="visionaries-title">
      <div className="visionaries-inner wrap">
        {/* Top: BlurText main heading + description */}
        <div className="vis-content">
          <BlurText
            id="visionaries-title"
            text="Where Visionaries and Leaders Unite"
            className="vis-heading"
            delay={150}
          />

          <p className="vis-body">
            Bringing together distinguished leaders, celebrated personalities and influential
            voices on one prestigious platform.
          </p>
        </div>

        {/* Bottom: auto-sliding & rotating image gallery */}
        <div className="vis-gallery">
          <VisionarySlider />
        </div>
      </div>
    </section>
  );
}
