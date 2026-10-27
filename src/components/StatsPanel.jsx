import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { emit, on, sceneState } from "../lib/bus";
import { ease } from "../lib/motion";

const ACCENTS = ["#a99bff", "#5eead4", "#fbbf24", "#fb7185", "#60a5fa"];
const DEFAULTS = { size: 1, noise: 1, speed: 1, accent: null };

// "Under the hood": live render stats plus sliders that drive the shader uniforms.
export default function StatsPanel() {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState(sceneState.stats);
  const [tweak, setTweak] = useState(sceneState.tweak);

  useEffect(() => on("stats:toggle", (force) => setOpen((o) => (typeof force === "boolean" ? force : !o))), []);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setStats({ ...sceneState.stats }), 500);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearInterval(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const set = (patch) => {
    sceneState.tweak = { ...sceneState.tweak, ...patch };
    setTweak(sceneState.tweak);
    emit("scene:accent"); // redraw when rendering on demand
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          aria-label="Render stats"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.45, ease }}
          className="fixed inset-x-4 top-20 z-[45] rounded-2xl border border-white/10 bg-ink-900/85 p-5 font-mono text-xs shadow-2xl shadow-black/60 backdrop-blur-xl sm:left-auto sm:right-6 sm:w-80"
        >
          <div className="flex items-center justify-between">
            <p className="label text-accent">Under the hood</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close stats"
              className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-white/60 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            <Stat label="fps" value={stats.fps || "—"} />
            <Stat label="particles" value={stats.particles.toLocaleString()} />
            <Stat label="pixel ratio" value={stats.dpr} />
            <Stat label="draw calls" value="1" />
            <div className="col-span-2">
              <dt className="text-white/40">gpu</dt>
              <dd className="mt-0.5 truncate text-white/80" title={stats.renderer}>
                {stats.renderer || "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-5 space-y-4 border-t border-white/[0.08] pt-5">
            <Slider label="point size" value={tweak.size} min={0.4} max={2.2} onChange={(size) => set({ size })} />
            <Slider label="turbulence" value={tweak.noise} min={0} max={4} onChange={(noise) => set({ noise })} />
            <Slider label="spin" value={tweak.speed} min={0} max={5} onChange={(speed) => set({ speed })} />
            <div>
              <p className="text-white/40">accent</p>
              <div className="mt-2 flex gap-2">
                {ACCENTS.map((c, i) => {
                  const active = (tweak.accent ?? ACCENTS[0]) === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Accent ${c}`}
                      aria-pressed={active}
                      onClick={() => set({ accent: i === 0 ? null : c })}
                      className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${active ? "ring-2 ring-white/70 ring-offset-2 ring-offset-ink-900" : ""}`}
                      style={{ background: c }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 text-white/40">
            <span>three.js · custom GLSL</span>
            <button type="button" onClick={() => set(DEFAULTS)} className="text-white/60 hover:text-white">
              reset
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-white/40">{label}</dt>
      <dd className="mt-0.5 text-base text-white">{value}</dd>
    </div>
  );
}

function Slider({ label, value, min, max, onChange }) {
  return (
    <label className="block">
      <span className="flex justify-between text-white/40">
        {label}
        <span className="text-white/70">{value.toFixed(1)}×</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#a99bff]"
      />
    </label>
  );
}
