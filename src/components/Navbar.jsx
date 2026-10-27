import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "../data/site";
import { emit } from "../lib/bus";
import { lockScroll, unlockScroll } from "../lib/scroll";
import { ease } from "../lib/motion";

function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const sectionIds = nav.map((n) => n.id);
const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav className="container-page flex h-16 items-center justify-between" aria-label="Primary">
          <a href="#top" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 font-mono text-[11px] tracking-wider text-white transition-colors group-hover:border-accent/60">
              AK
            </span>
            <span className="text-sm font-medium tracking-tight text-white/90">{site.name}</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                  active === item.id ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.07]"
                    transition={{ duration: 0.5, ease }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => emit("terminal:open")}
              aria-label="Open terminal"
              className="hidden items-center gap-2 rounded-full border border-white/15 py-2 pl-3 pr-2 font-mono text-xs text-white/70 transition-colors hover:border-white/40 hover:text-white md:inline-flex"
            >
              <span aria-hidden="true">&gt;_</span>
              <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/50">{shortcut}</kbd>
            </button>
            <a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-white/40 sm:inline-flex"
            >
              Résumé
              <ArrowUpRight size={14} />
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 md:hidden"
            >
              <span
                className={`absolute h-px w-4 bg-white transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-[3px]"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-white transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-[3px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-30 flex flex-col bg-ink-950 px-4 pb-10 pt-24 md:hidden"
          >
            <ul className="flex flex-col">
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.05 + i * 0.05 }}
                  className="border-b border-white/[0.08]"
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-5 text-4xl font-medium tracking-[-0.03em]"
                  >
                    {item.label}
                    <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                emit("terminal:open");
              }}
              className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 px-5 py-4 text-left font-mono text-sm text-white/70"
            >
              <span>
                <span className="text-accent">&gt;_</span> open terminal
              </span>
              <span className="text-white/40">try it</span>
            </button>
            <div className="mt-auto flex flex-wrap gap-3 text-sm">
              <a href={site.resume} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2">
                Résumé ↗
              </a>
              <a href={site.github} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2">
                GitHub ↗
              </a>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2">
                LinkedIn ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
