import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award } from "lucide-react";
import { on } from "../lib/bus";
import { ease } from "../lib/motion";

export default function AchievementToast() {
  const [current, setCurrent] = useState(null);
  const queue = useRef([]);
  const timer = useRef();

  useEffect(() => {
    const next = () => {
      const item = queue.current.shift();
      setCurrent(item ?? null);
      timer.current = item ? setTimeout(next, 3200) : undefined;
    };
    const off = on("achievement", (a) => {
      queue.current.push(a);
      if (!timer.current) next();
    });
    return () => {
      off();
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[55] sm:bottom-6 sm:right-6">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-ink-900/90 py-3 pl-3 pr-5 shadow-2xl shadow-accent/10 backdrop-blur-xl"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent-soft">
              <Award size={18} />
            </span>
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                Achievement · {current.count}/{current.total}
              </span>
              <span className="block text-sm text-white">{current.title}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
