import React, { useRef, useEffect } from "react";

/**
 * TextPressure — letters bulge toward the cursor like pressing on a membrane.
 * Supports natural multiline word-wrapping and falls back gracefully for reduced motion.
 */
export function TextPressure({ text = "", className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e) => {
      const spans = container.querySelectorAll(".tp-char");
      spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const maxDist = 140;
        const proximity = Math.max(0, 1 - dist / maxDist);
        const weight = Math.round(400 + proximity * 500); // 400–900
        const stretch = Math.round(62 + proximity * 38);  // 62%–100%
        span.style.fontWeight = weight;
        span.style.fontStretch = `${stretch}%`;
        span.style.setProperty("font-variation-settings", `"wdth" ${stretch}`);
      });
    };

    const onLeave = () => {
      const spans = container.querySelectorAll(".tp-char");
      spans.forEach((span) => {
        span.style.fontWeight = "";
        span.style.fontStretch = "";
        span.style.setProperty("font-variation-settings", "");
      });
    };

    window.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [text]);

  const words = text.split(" ");

  return (
    <span ref={containerRef} className={`text-pressure ${className}`} aria-label={text}>
      {words.map((word, wIdx) => (
        <React.Fragment key={wIdx}>
          <span className="tp-word" style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.split("").map((char, cIdx) => (
              <span
                key={cIdx}
                className="tp-char"
                aria-hidden="true"
                style={{ display: "inline-block", transition: "font-weight 0.12s, font-stretch 0.12s" }}
              >
                {char}
              </span>
            ))}
          </span>
          {wIdx < words.length - 1 && (
            <span className="tp-space" style={{ display: "inline-block", width: "0.28em" }}>
              {" "}
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}
