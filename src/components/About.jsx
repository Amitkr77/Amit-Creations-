import { Reveal, SectionHeader, Serif } from "./ui/Reveal";

const principles = [
  {
    title: "Craft",
    text: "Pixel-careful interfaces in React and Tailwind — fast, accessible and pleasant to use.",
  },
  {
    title: "Build",
    text: "Scalable APIs with Node.js and Python. Secure by default, cloud-native, real-time where it matters.",
  },
  {
    title: "Ship",
    text: "Features people actually use. Performance, developer experience and accessibility, every release.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 sm:py-40">
      <div className="container-page">
        <SectionHeader
          index="02"
          label="About"
          title={
            <>
              From first spark <Serif>to scalable deploy.</Serif>
            </>
          }
        />

        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal as="p" className="text-xl leading-[1.5] tracking-[-0.01em] text-white/85 sm:text-2xl">
              I&apos;m a full-stack engineer who ships high-impact, production-grade web apps. I pair
              elegant, accessible frontends with robust, secure backends — so every pixel and every API
              call is intentional.
            </Reveal>
            <Reveal as="p" delay={0.08} className="mt-6 max-w-xl leading-relaxed text-white/55">
              Real-time dashboards, AI-powered tools, commerce flows for both shoppers and businesses —
              I build systems that scale gracefully and stay a pleasure to use.
            </Reveal>
            <Reveal delay={0.12} className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 font-mono text-xs text-white/60">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Currently crafting something new
            </Reveal>
          </div>

          <ol className="lg:col-span-5">
            {principles.map((p, i) => (
              <Reveal
                as="li"
                key={p.title}
                delay={0.06 * i}
                className="grid grid-cols-[3rem_1fr] border-t border-white/[0.08] py-7 last:border-b"
              >
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
