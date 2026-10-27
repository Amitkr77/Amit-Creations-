import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { emit } from "../lib/bus";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const isTyping = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

export default function KeyboardEasterEggs({ sceneOn, onToggleScene }) {
  const [toast, setToast] = useState("");
  const keys = useRef([]);
  const timer = useRef();

  const show = (message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 1800);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;

      keys.current = [...keys.current, e.key].slice(-KONAMI.length);
      if (KONAMI.every((k, i) => keys.current[i] === k)) {
        keys.current = [];
        emit("scene:burst");
        show("Konami unlocked ✦");
        return;
      }

      if (e.key.toLowerCase() === "p") {
        onToggleScene();
        show(sceneOn ? "Particles paused" : "Particles resumed");
      } else if (e.key === "?") {
        emit("terminal:open", { run: "help" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sceneOn, onToggleScene]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-full border border-white/10 bg-ink-800/90 px-4 py-2 font-mono text-xs text-white/80 backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
