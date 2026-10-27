import { forwardRef, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { lockScroll, unlockScroll } from "../../lib/scroll";
import { ease } from "../../lib/motion";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// `sharedImage`: the screenshot animates in from the featured card (only on the first open from a card)
export default function ProjectModal({ project, projects, sharedImage, onNavigate, onClose }) {
  const panel = useRef(null);
  const scroller = useRef(null);
  const closeBtn = useRef(null);
  const drag = useDragControls();
  const [scrolled, setScrolled] = useState(false);


  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const accent = project.accent ?? "#a99bff";

  useEffect(() => {
    lockScroll();
    closeBtn.current?.focus({ preventScroll: true });
    return unlockScroll;
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowLeft") return onNavigate(prev);
      if (e.key === "ArrowRight") return onNavigate(next);
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
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, prev, next]);

  // New project: start reading from the top
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [project]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/80 backdrop-blur-md md:items-center md:p-6"
      onClick={onClose}
    >
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        initial={{ y: sharedImage ? 0 : 48, opacity: sharedImage ? 1 : 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0 }}
        transition={{ duration: 0.55, ease }}
        drag="y"
        dragControls={drag}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => (info.offset.y > 140 || info.velocity.y > 700) && onClose()}
        onClick={(e) => e.stopPropagation()}
        style={{ "--p": accent }}
        className="relative flex h-[94svh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-ink-900 shadow-2xl shadow-black/60 md:h-auto md:max-h-[90vh] md:max-w-5xl md:rounded-[28px]"
      >
        {/* Mobile: grab handle to drag the sheet down */}
        <div
          onPointerDown={(e) => drag.start(e)}
          className="absolute inset-x-0 top-0 z-30 flex h-6 cursor-grab touch-none justify-center pt-2 md:hidden"
          aria-hidden="true"
        >
          <span className="h-1 w-10 rounded-full bg-white/30" />
        </div>

        {/* Top bar floats over the hero, gains a backdrop once the content scrolls under it */}
        <div
          className={`absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-4 pb-3 pt-6 transition-colors duration-300 sm:px-6 md:pt-4 ${
            scrolled
              ? "border-b border-white/[0.06] bg-ink-900/85 backdrop-blur-xl"
              : "bg-gradient-to-b from-ink-950/70 via-ink-950/25 to-transparent"
          }`}
        >
          <p className="rounded-full bg-ink-950/60 px-3 py-1.5 font-mono text-[11px] text-white/70 backdrop-blur">
            {String(index + 1).padStart(2, "0")}
            <span className="text-white/35"> / {String(projects.length).padStart(2, "0")}</span>
          </p>
          <div className="flex items-center gap-2">
            <IconButton label={`Previous: ${prev.name}`} onClick={() => onNavigate(prev)} className="hidden sm:grid">
              <ArrowLeft size={16} />
            </IconButton>
            <IconButton label={`Next: ${next.name}`} onClick={() => onNavigate(next)} className="hidden sm:grid">
              <ArrowRight size={16} />
            </IconButton>
            <IconButton ref={closeBtn} label="Close case study" onClick={onClose}>
              <X size={17} />
            </IconButton>
          </div>
        </div>

        <div
          ref={scroller}
          data-lenis-prevent
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 40)}
          className="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={project.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
            >
              <Hero project={project} shared={sharedImage} />

              <header className="relative -mt-16 px-5 sm:-mt-24 sm:px-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--p)]">
                  Case study{project.context && <span className="text-white/45"> · {project.context}</span>}
                </p>
                <h2
                  id="project-title"
                  className="mt-3 text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.045em]"
                >
                  {project.name}
                </h2>
                <p className="mt-3 text-lg text-white/55">{project.tagline}</p>
                {/* Mobile: links up front instead of after the whole case study */}
                <div className="mt-6 flex flex-wrap gap-2 md:hidden">
                  <ProjectButtons project={project} compact />
                </div>
              </header>

              <div className="grid gap-12 px-5 pb-12 pt-10 sm:px-10 md:grid-cols-[1fr_15rem] md:gap-14">
                <div className="min-w-0 space-y-14">
                  <p className="text-xl leading-relaxed tracking-[-0.01em] text-white/85 sm:text-[1.35rem]">
                    {project.description}
                  </p>

                  {project.challenge && (
                    <Section n="01" title="The challenge">
                      <p className="border-l-2 border-[color:var(--p)] pl-5 text-lg leading-relaxed text-white/75">
                        {project.challenge}
                      </p>
                    </Section>
                  )}

                  {project.solution?.length > 0 && (
                    <Section n={project.challenge ? "02" : "01"} title="Approach">
                      <ol className="grid gap-3 sm:grid-cols-2">
                        {project.solution.map((step, i) => (
                          <li
                            key={step}
                            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.04]"
                          >
                            <span className="font-mono text-[11px] text-[color:var(--p)]">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <p className="mt-2 leading-relaxed text-white/75">{step}</p>
                          </li>
                        ))}
                      </ol>
                    </Section>
                  )}

                  {project.results?.length > 0 && (
                    <Section n={String(1 + !!project.challenge + !!project.solution?.length).padStart(2, "0")} title="Outcomes">
                      <ul className="space-y-3">
                        {project.results.map((r) => (
                          <li key={r} className="flex gap-3 leading-relaxed text-white/75">
                            <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--p)_15%,transparent)] text-[color:var(--p)]">
                              <Check size={12} strokeWidth={3} />
                            </span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}
                </div>

                <Sidebar project={project} />
              </div>

              <nav aria-label="More case studies" className="grid border-t border-white/[0.08] sm:grid-cols-2">
                <PagerLink project={prev} direction="prev" onClick={() => onNavigate(prev)} />
                <PagerLink project={next} direction="next" onClick={() => onNavigate(next)} />
              </nav>
            </motion.article>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Hero({ project, shared }) {
  if (!project.image) {
    // No screenshot: an accent field with the name as a giant watermark
    return (
      <div className="relative h-56 overflow-hidden sm:h-72" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--p),transparent_60%)] opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <p className="absolute -bottom-6 right-4 select-none text-[clamp(5rem,16vw,11rem)] font-medium leading-none tracking-[-0.06em] text-white/[0.04]">
          {project.name}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-900 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        layoutId={shared ? `shot-${project.name}` : undefined}
        transition={{ duration: 0.7, ease }}
        className="aspect-[16/10] w-full overflow-hidden bg-ink-800 sm:aspect-[16/8]"
      >
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          className="h-full w-full object-cover object-top"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-900 via-ink-900/70 to-transparent" />
    </div>
  );
}

function Section({ n, title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease }}
    >
      <h3 className="mb-6 flex items-center gap-4">
        <span className="font-mono text-xs text-[color:var(--p)]">{n}</span>
        <span className="h-px w-8 bg-white/15" />
        <span className="text-xl font-medium tracking-[-0.02em]">{title}</span>
      </h3>
      {children}
    </motion.section>
  );
}

function Sidebar({ project }) {
  return (
    <aside className="md:sticky md:top-20 md:self-start">
      <div className="hidden space-y-3 md:block">
        <ProjectButtons project={project} />
      </div>

      <dl className="space-y-5 border-t border-white/[0.08] pt-6 text-sm md:mt-8">
        <div>
          <dt className="label">Status</dt>
          <dd className="mt-2 flex items-center gap-2 text-white/80">
            <span className="relative flex h-2 w-2">
              {project.liveUrl && (
                <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--p)] opacity-60 motion-reduce:hidden" />
              )}
              <span className={`relative h-2 w-2 rounded-full ${project.liveUrl ? "bg-[color:var(--p)]" : "bg-white/30"}`} />
            </span>
            {project.inProgress ? "In progress" : project.liveUrl ? "Live" : "Source available"}
          </dd>
        </div>
        {project.context && (
          <div>
            <dt className="label">Context</dt>
            <dd className="mt-2 text-white/80">{project.context}</dd>
          </div>
        )}
        <div>
          <dt className="label">Stack</dt>
          <dd className="mt-3">
            <ul className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/65">
                  {t}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </aside>
  );
}

function ProjectButtons({ project, compact = false }) {
  const base = `group flex items-center justify-between gap-3 rounded-full text-sm transition-colors ${
    compact ? "px-4 py-2.5" : "px-5 py-3"
  }`;
  const arrow = (
    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  );
  return (
    <>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} bg-white font-medium text-ink-950 hover:bg-accent-soft`}
        >
          Visit live site
          {arrow}
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} border border-white/15 text-white hover:border-white/40`}
        >
          View source
          {arrow}
        </a>
      )}
    </>
  );
}

function PagerLink({ project, direction, onClick }) {
  const next = direction === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ "--q": project.accent ?? "#a99bff" }}
      className={`group relative overflow-hidden px-5 py-8 text-left transition-colors hover:bg-white/[0.02] sm:px-10 ${
        next ? "sm:border-l sm:border-white/[0.08] sm:text-right" : "border-b border-white/[0.08] sm:border-b-0"
      }`}
    >
      <span
        className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 ${next ? "sm:justify-end" : ""}`}
      >
        {!next && <ArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-1" />}
        {next ? "Next project" : "Previous project"}
        {next && <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />}
      </span>
      <span className="mt-3 block text-2xl font-medium tracking-[-0.03em] transition-colors duration-300 group-hover:text-[color:var(--q)]">
        {project.name}
      </span>
      <span className="mt-1 block truncate text-sm text-white/45">{project.tagline}</span>
    </button>
  );
}

const IconButton = forwardRef(function IconButton({ label, onClick, className = "grid", children }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`${className} h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink-950/60 text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white`}
    >
      {children}
    </button>
  );
});
