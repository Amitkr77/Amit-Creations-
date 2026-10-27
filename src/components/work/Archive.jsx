import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { clearProjectFocus, focusProject } from "../../lib/bus";
import ProjectLinks from "./ProjectLinks";

const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function Archive({ projects, onOpen }) {
  const [hovered, setHovered] = useState(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  const onMove = (e) => {
    x.set(e.clientX + 24);
    y.set(e.clientY - 90);
  };

  const preview = hovered?.image && canHover() ? hovered : null;

  return (
    <>
      <ul
        className="border-t border-white/[0.08]"
        onPointerMove={onMove}
        onPointerLeave={() => {
          setHovered(null);
          clearProjectFocus();
        }}
      >
        {projects.map((p, i) => (
          <Reveal
            as="li"
            key={p.name}
            delay={Math.min(i, 5) * 0.04}
            y={16}
            onPointerEnter={() => {
              setHovered(p);
              focusProject(p);
            }}
            className="group relative grid grid-cols-[2.25rem_1fr_auto] items-center gap-4 border-b border-white/[0.08] py-6 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[3rem_1.1fr_1fr_auto] md:gap-6"
          >
            <span className="font-mono text-xs text-white/35">{String(i + 1).padStart(2, "0")}</span>

            <div className="min-w-0">
              <button
                type="button"
                onClick={(e) => onOpen(p, e)}
                data-cursor="Open"
                className="text-left text-lg font-medium tracking-[-0.02em] text-white transition-transform duration-500 ease-out after:absolute after:inset-0 after:content-[''] group-hover:translate-x-1 sm:text-xl"
              >
                {p.name}
              </button>
              <p className="mt-1 truncate text-sm text-white/50">{p.tagline}</p>
            </div>

            <p className="hidden truncate font-mono text-[11px] text-white/45 md:block">
              {p.tech.slice(0, 4).join(" · ")}
            </p>

            <div className="relative z-10 flex items-center gap-5">
              <ProjectLinks project={p} className="hidden md:flex" />
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white md:hidden"
              />
            </div>
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {preview && (
          <motion.div
            key="preview"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{ left: sx, top: sy }}
            className="pointer-events-none fixed z-30 hidden h-[180px] w-[290px] overflow-hidden rounded-xl border border-white/10 bg-ink-800 shadow-2xl shadow-black/60 lg:block"
          >
            <img src={preview.image} alt="" className="h-full w-full object-cover object-top" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
