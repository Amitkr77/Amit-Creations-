import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

const supported = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Dot tracks the pointer exactly; the ring trails on a spring and grows over interactive
// elements. Elements with data-cursor="Label" show that label inside the ring.
export default function Cursor() {
  const [enabled] = useState(supported);
  const [state, setState] = useState({ hover: false, label: "", down: false, visible: false });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 420, damping: 36, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");

    const move = (e) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setState((s) => (s.visible ? s : { ...s, visible: true }));
    };
    const over = (e) => {
      const target = e.target.closest?.("[data-cursor], a, button, [role=button], input[type=range]");
      const label = target?.closest("[data-cursor]")?.dataset.cursor ?? "";
      setState((s) => (s.hover === !!target && s.label === label ? s : { ...s, hover: !!target, label }));
    };
    const down = () => setState((s) => ({ ...s, down: true }));
    const up = () => setState((s) => ({ ...s, down: false }));
    const leave = () => setState((s) => ({ ...s, visible: false }));

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = state.label ? 84 : state.hover ? 44 : 28;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]" style={{ opacity: state.visible ? 1 : 0 }}>
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          scale: state.down ? 0.85 : 1,
          borderColor: state.label ? "rgba(169,155,255,0)" : state.hover ? "rgba(207,198,255,0.7)" : "rgba(255,255,255,0.28)",
          backgroundColor: state.label ? "rgba(169,155,255,0.92)" : "rgba(169,155,255,0)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        <AnimatePresence>
          {state.label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[11px] font-medium text-ink-950"
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: state.label ? 0 : 1, scale: state.hover ? 0.5 : 1 }}
      />
    </div>
  );
}
