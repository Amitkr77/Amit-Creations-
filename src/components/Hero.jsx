import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { projects } from "../data/projects";
import { site } from "../data/site";
import { ease } from "../lib/motion";
import { useIntroDone } from "../lib/useIntroDone";
import Magnetic from "./ui/Magnetic";
import { Serif } from "./ui/Reveal";

const headline = [
  ["Building"],
  ["fast,", <Serif key="s">considered</Serif>],
  ["web products —"],
  ["end to end."],
];

const stats = [
  { value: `${projects.filter((p) => !p.inProgress).length}`, label: "Projects shipped" },
  { value: "2+", label: "Years building" },
  { value: "Full-stack", label: "React · Node · Python" },
];

// Content waits for the particle intro to release before revealing
const fade = (ready, delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
  transition: { duration: 1, ease, delay },
});

export default function Hero() {
  const ready = useIntroDone();

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col pt-16">
      <div className="container-page flex flex-1 flex-col justify-center py-16 sm:py-24">
        <motion.p {...fade(ready, 0.1)} className="flex items-center gap-3 font-mono text-xs text-white/60">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-accent" />
          </span>
          Full-stack engineer · {site.location}
        </motion.p>

        <h1 className="mt-8 max-w-[15ch] text-[clamp(2.75rem,8.4vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.045em] lg:max-w-[12ch]">
          {headline.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: ready ? 0 : "105%" }}
                transition={{ duration: 1.1, ease, delay: 0.25 + i * 0.09 }}
              >
                {line.map((part, j) => (
                  <span key={j}>
                    {j > 0 && " "}
                    {part}
                  </span>
                ))}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p {...fade(ready, 0.75)} className="mt-8 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
          I design and ship production-grade web apps — React and Next.js frontends, Node and Python
          backends, deployed to the cloud and built to scale.
        </motion.p>

        <motion.div {...fade(ready, 0.9)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Magnetic>
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors hover:bg-accent-soft"
            >
              View selected work
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
          <a href="#contact" className="link-underline text-sm text-white/80 hover:text-white">
            Get in touch
          </a>
        </motion.div>
      </div>

      <motion.div {...fade(ready, 1.1)} className="container-page pb-8">
        <div className="flex items-end justify-between gap-6 border-t border-white/[0.08] pt-6">
          <dl className="grid grid-cols-2 gap-x-10 gap-y-4 sm:flex sm:gap-14">
            {stats.map((s) => (
              <div key={s.label} className={`flex-col-reverse ${s.value === "Full-stack" ? "hidden sm:flex" : "flex"}`}>
                <dt className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{s.label}</dt>
                <dd className="text-xl font-medium tracking-tight text-white sm:text-2xl">{s.value}</dd>
              </div>
            ))}
          </dl>
          <a href="#work" aria-label="Scroll to work" className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45 hover:text-white sm:flex">
            Scroll
            <ArrowDown size={14} className="animate-bounce motion-reduce:animate-none" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
