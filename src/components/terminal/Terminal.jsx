import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { on } from "../../lib/bus";
import { ease } from "../../lib/motion";
import { lockScroll, unlockScroll } from "../../lib/scroll";
import { commands, complete, suggestions } from "./commands";

const PROMPT = "amit@portfolio:~$";

const isTyping = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

const welcome = () => ({
  id: 0,
  kind: "out",
  node: (
    <p className="text-white/50">
      amit.sh 1.0 — type <span className="text-accent-soft">help</span> to see what this can do.
    </p>
  ),
});

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState(() => [welcome()]);
  const [input, setInput] = useState("");
  const history = useRef([]);
  const histIdx = useRef(-1);
  const nextId = useRef(1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const returnFocus = useRef(null);
  const queued = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  const run = useCallback(
    (raw) => {
      const text = raw.trim();
      const entry = { id: nextId.current++, kind: "in", node: raw };
      if (!text) return setLines((l) => [...l, entry]);

      history.current = [...history.current, text].slice(-50);
      histIdx.current = -1;
      const [name, ...args] = text.split(/\s+/);
      const cmd = commands[name.toLowerCase()];

      let cleared = false;
      const ctx = {
        close,
        clear: () => (cleared = true),
        history: history.current,
      };
      const result = cmd ? cmd.run(args, ctx) : `command not found: ${name} — type \`help\``;

      if (cleared) return setLines([]);
      setLines((l) => [
        ...l,
        entry,
        ...(result != null && result !== "" ? [{ id: nextId.current++, kind: "out", node: result }] : []),
      ]);
    },
    [close]
  );

  // Open via ⌘K / Ctrl+K anywhere, or ` when not typing; other components emit terminal:open
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "`" && !isTyping(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    const off = on("terminal:open", (opts) => {
      queued.current = opts?.run ?? null;
      setOpen(true);
    });
    return () => {
      window.removeEventListener("keydown", onKey);
      off();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    lockScroll();
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    if (queued.current) {
      run(queued.current);
      queued.current = null;
    }
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open, run, close]);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const done = complete(input);
      if (done) setInput(done);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (!h.length) return;
      let i = histIdx.current === -1 ? h.length : histIdx.current;
      i = e.key === "ArrowUp" ? Math.max(0, i - 1) : i + 1;
      if (i >= h.length) {
        histIdx.current = -1;
        setInput("");
      } else {
        histIdx.current = i;
        setInput(h[i]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/40 md:pb-10"
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
            initial={{ y: 32, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease }}
            onClick={(e) => {
              e.stopPropagation();
              if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
            }}
            className="flex h-[72svh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-ink-900/95 font-mono text-[13px] shadow-2xl shadow-black/70 backdrop-blur-xl md:h-[min(480px,62vh)] md:w-[min(760px,calc(100%-2rem))] md:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
              </div>
              <span className="text-[11px] text-white/40">amit.sh — zsh</span>
              <button
                type="button"
                onClick={close}
                className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] text-white/50 transition-colors hover:text-white"
              >
                esc
              </button>
            </div>

            <div
              ref={outputRef}
              data-lenis-prevent
              aria-live="polite"
              className="flex-1 space-y-2 overflow-y-auto overscroll-contain px-4 py-4 leading-relaxed text-white/85"
            >
              {lines.map((line) =>
                line.kind === "in" ? (
                  <p key={line.id} className="break-all">
                    <span className="text-accent">{PROMPT}</span> {line.node}
                  </p>
                ) : (
                  <div key={line.id} className="whitespace-pre-wrap break-words">
                    {line.node}
                  </div>
                )
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto border-t border-white/[0.06] px-4 py-2.5 [scrollbar-width:none]">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => run(s)}
                  className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/55 transition-colors hover:border-accent/50 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 border-t border-white/[0.08] px-4 py-3.5">
              <span className="shrink-0 text-accent" aria-hidden="true">
                {PROMPT}
              </span>
              <span className="sr-only">Terminal command</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                className="min-w-0 flex-1 bg-transparent text-white caret-accent outline-none"
              />
            </label>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
