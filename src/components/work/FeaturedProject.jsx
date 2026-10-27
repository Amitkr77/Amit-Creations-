import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { clearProjectFocus, focusProject } from "../../lib/bus";
import { ease } from "../../lib/motion";
import { Reveal } from "../ui/Reveal";
import ProjectLinks from "./ProjectLinks";

export default function FeaturedProject({ project, index, onOpen }) {
  const flip = index % 2 === 1;
  const shot = useRef(null);

  // The particle field gathers around the screenshot and takes on the project colour
  const focus = () => focusProject(project, shot.current);

  // Subtle pointer-driven tilt on the screenshot
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [3, -3]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 20 });

  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <article
      className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
      onPointerEnter={(e) => e.pointerType === "mouse" && focus()}
      onPointerLeave={clearProjectFocus}
      onFocus={focus}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && clearProjectFocus()}
    >
      <motion.div
        initial={{ opacity: 0, y: 48, clipPath: "inset(12% 6% 12% 6% round 20px)" }}
        whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 20px)" }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1.2, ease }}
        className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
        style={{ perspective: 1200 }}
      >
        <motion.button
          ref={shot}
          type="button"
          onClick={(e) => onOpen(project, e)}
          onPointerMove={onMove}
          onPointerLeave={reset}
          style={{ rotateX: rx, rotateY: ry }}
          aria-label={`Open ${project.name} case study`}
          data-cursor="View"
          className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-white/[0.08] bg-ink-800"
        >
          {/* Shared with the modal's hero image: the screenshot grows into the case study */}
          <motion.div layoutId={`shot-${project.name}`} className="h-full w-full overflow-hidden">
            <img
              src={project.image}
              alt=""
              loading="lazy"
              decoding="async"
              width="1600"
              height="1000"
              className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.035]"
            />
          </motion.div>
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40" />
          <span className="cursor-hide absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-ink-950 opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
            Case study <ArrowRight size={14} />
          </span>
        </motion.button>
      </motion.div>

      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <Reveal className="font-mono text-xs text-white/40">
          {String(index + 1).padStart(2, "0")} / {project.context ?? "Featured"}
        </Reveal>
        <Reveal as="h3" delay={0.05} className="mt-4 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
          {project.name}
        </Reveal>
        <Reveal delay={0.08} className="mt-2 text-white/50">
          {project.tagline}
        </Reveal>
        <Reveal delay={0.12} className="mt-6 leading-relaxed text-white/70">
          {project.description}
        </Reveal>
        <Reveal delay={0.16} as="ul" className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.tech.map((t) => (
            <li key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60">
              {t}
            </li>
          ))}
        </Reveal>
        <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={(e) => onOpen(project, e)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-white"
          >
            <span className="link-underline">Read case study</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
          <ProjectLinks project={project} />
        </Reveal>
      </div>
    </article>
  );
}
