import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { lockScroll, unlockScroll } from "../../lib/scroll";
import { ease } from "../../lib/motion";
import ProjectLinks from "./ProjectLinks";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProjectModal({ project, onClose }) {
  const panel = useRef(null);
  const closeBtn = useRef(null);

  useEffect(() => {
    lockScroll();
    closeBtn.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const nodes = panel.current.querySelectorAll(FOCUSABLE);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
    >
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        initial={{ y: project.featured ? 0 : 40, opacity: project.featured ? 1 : 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.5, ease }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="relative max-h-[92svh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-ink-900 md:max-h-[88vh] md:max-w-3xl md:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex h-0 justify-end">
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="mr-4 mt-4 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-ink-900/80 backdrop-blur transition-colors hover:border-white/40"
          >
            <X size={18} />
          </button>
        </div>

        {project.image && (
          <motion.div
            layoutId={`shot-${project.name}`}
            transition={{ duration: 0.7, ease }}
            className="aspect-[16/9] w-full overflow-hidden border-b border-white/[0.08] bg-ink-800"
          >
            <img src={project.image} alt={`${project.name} screenshot`} className="h-full w-full object-cover object-top" />
          </motion.div>
        )}

        <div className="px-5 pb-10 pt-8 sm:px-10">
          <p className="label">{project.context ? `Case study · ${project.context}` : "Case study"}</p>
          <h2 id="project-title" className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
            {project.name}
          </h2>
          <p className="mt-2 text-white/50">{project.tagline}</p>
          <ProjectLinks project={project} className="mt-5" />

          <p className="mt-8 text-lg leading-relaxed text-white/75">{project.description}</p>

          <div className="mt-10 grid gap-10 border-t border-white/[0.08] pt-10">
            {project.challenge && (
              <Block title="Challenge">
                <p className="leading-relaxed text-white/70">{project.challenge}</p>
              </Block>
            )}
            {project.solution?.length > 0 && (
              <Block title="Approach">
                <List items={project.solution} />
              </Block>
            )}
            {project.results?.length > 0 && (
              <Block title="Outcomes">
                <List items={project.results} />
              </Block>
            )}
            <Block title="Stack">
              <ul className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <li key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60">
                    {t}
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Block({ title, children }) {
  return (
    <section className="grid gap-4 sm:grid-cols-[9rem_1fr]">
      <h3 className="label pt-1">{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function List({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-white/70">
          <span className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}
