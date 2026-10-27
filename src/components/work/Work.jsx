import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../../data/projects";
import { site } from "../../data/site";
import { trackCaseStudy } from "../../lib/achievements";
import { clearProjectFocus, on } from "../../lib/bus";
import { Reveal, SectionHeader, Serif } from "../ui/Reveal";
import FeaturedProject from "./FeaturedProject";
import Archive from "./Archive";
import ProjectModal from "./ProjectModal";

const featured = projects.filter((p) => p.featured);
const archive = projects.filter((p) => !p.featured);
// Modal paging follows the order projects appear on the page
const ordered = [...featured, ...archive];

export default function Work() {
  const [selected, setSelected] = useState(null);
  const trigger = useRef(null);

  // shared: the featured card's screenshot morphs into the modal (only when clicked from that card)
  const open = useCallback((project, e) => {
    trigger.current = e?.currentTarget ?? null;
    setSelected({ project, shared: !!e && !!project.featured });
    trackCaseStudy(project.name);
    clearProjectFocus(); // the modal covers the card, so pointerleave won't fire
  }, []);

  // The terminal can open a case study by name
  useEffect(() => on("project:open", (project) => open(project)), [open]);

  const navigate = useCallback((project) => {
    setSelected({ project, shared: false });
    trackCaseStudy(project.name);
  }, []);

  const close = useCallback(() => {
    setSelected(null);
    trigger.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section id="work" className="relative py-28 sm:py-40">
      <div className="container-page">
        <SectionHeader
          index="01"
          label="Selected work"
          title={
            <>
              Products shipped <Serif>to production.</Serif>
            </>
          }
          aside={
            <p className="max-w-[16rem] text-sm leading-relaxed text-white/50">
              {projects.length} projects, from AI agents to commerce platforms — most of them live.
            </p>
          }
        />

        <div className="flex flex-col gap-24 sm:gap-32">
          {featured.map((p, i) => (
            <FeaturedProject key={p.name} project={p} index={i} onOpen={open} />
          ))}
        </div>

        <div className="mt-32 sm:mt-44">
          <Reveal className="mb-8 flex items-end justify-between gap-4">
            <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">More projects</h3>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
            >
              All on GitHub <ArrowUpRight size={14} />
            </a>
          </Reveal>
          <Archive projects={archive} onOpen={open} />
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {selected && (
            <ProjectModal
              project={selected.project}
              projects={ordered}
              sharedImage={selected.shared}
              onNavigate={navigate}
              onClose={close}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
