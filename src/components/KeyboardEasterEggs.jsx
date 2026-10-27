import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { lockScroll, unlockScroll } from "../lib/scroll";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const isTyping = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

export default function KeyboardEasterEggs({ sceneOn, onToggleScene, onKonami }) {
  const [toast, setToast] = useState("");
  const [help, setHelp] = useState(false);
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
        onKonami();
        show("Konami unlocked ✦");
        return;
      }

      if (e.key.toLowerCase() === "p") {
        onToggleScene();
        show(sceneOn ? "Particles paused" : "Particles resumed");
      } else if (e.key === "?") {
        setHelp((h) => !h);
      } else if (e.key === "Escape") {
        setHelp(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sceneOn, onToggleScene, onKonami]);

  useEffect(() => {
    if (!help) return;
    lockScroll();
    return unlockScroll;
  }, [help]);

  return (
    <>
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

      <AnimatePresence>
        {help && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setHelp(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Keyboard shortcuts"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-900 p-6"
            >
              <p className="label">Keyboard shortcuts</p>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["P", "Pause / resume particles"],
                  ["?", "Toggle this panel"],
                  ["↑↑↓↓←→←→ B A", "Something special"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4">
                    <dt className="text-white/70">{v}</dt>
                    <dd>
                      <kbd className="rounded-md border border-white/15 px-2 py-1 font-mono text-[11px] text-white/80">{k}</kbd>
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
