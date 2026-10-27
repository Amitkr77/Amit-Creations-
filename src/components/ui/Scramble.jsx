import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@01";

// Decodes from random glyphs into `text` the first time it scrolls into view.
export default function Scramble({ text, className = "", duration = 900 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf;
    const start = performance.now();
    // Each character settles at its own moment, left to right with jitter
    const settleAt = [...text].map((_, i) => (i / text.length) * 0.6 + Math.random() * 0.4);

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setOutput(
        [...text]
          .map((ch, i) =>
            ch === " " || t >= settleAt[i] ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{output}</span>
    </span>
  );
}
