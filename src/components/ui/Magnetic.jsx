import { motion, useMotionValue, useSpring } from "framer-motion";

// Pulls its child gently toward the pointer while hovered (mouse only).
export default function Magnetic({ strength = 0.3, className = "", children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const move = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
