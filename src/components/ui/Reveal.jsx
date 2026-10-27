import { motion } from "framer-motion";
import { ease } from "../../lib/motion";
import Scramble from "./Scramble";

export function Reveal({ as = "div", delay = 0, y = 28, className, children, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function SectionHeader({ index, label, title, aside }) {
  return (
    <div className="mb-14 sm:mb-20">
      <Reveal className="flex items-center gap-4">
        <Scramble text={index} className="label text-accent" duration={500} />
        <span className="h-px w-10 bg-white/15" />
        <Scramble text={label} className="label" />
      </Reveal>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Reveal
          as="h2"
          delay={0.05}
          className="max-w-3xl text-[clamp(2.1rem,5.2vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white"
        >
          {title}
        </Reveal>
        {aside && (
          <Reveal delay={0.1} className="shrink-0">
            {aside}
          </Reveal>
        )}
      </div>
    </div>
  );
}

export function Serif({ children }) {
  return <span className="font-serif font-normal italic tracking-[-0.01em] text-accent-soft">{children}</span>;
}
