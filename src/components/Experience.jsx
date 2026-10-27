import { education, experience } from "../data/site";
import { Reveal, SectionHeader, Serif } from "./ui/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 sm:py-40">
      <div className="container-page">
        <SectionHeader
          index="03"
          label="Experience"
          title={
            <>
              Where I&apos;ve been <Serif>shipping.</Serif>
            </>
          }
        />

        <ol className="relative">
          {experience.map((job, i) => (
            <Reveal
              as="li"
              key={job.role + job.org}
              delay={Math.min(i, 3) * 0.05}
              className="group grid gap-3 border-t border-white/[0.08] py-8 sm:grid-cols-[12rem_1fr] sm:gap-10 lg:grid-cols-[14rem_1fr]"
            >
              <div className="flex items-center gap-3 sm:items-start sm:pt-1">
                <span className="relative mt-px flex h-2 w-2 shrink-0">
                  {job.current && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                  )}
                  <span className={`relative h-2 w-2 rounded-full ${job.current ? "bg-accent" : "bg-white/25"}`} />
                </span>
                <span className="font-mono text-xs text-white/50">{job.period}</span>
              </div>

              <div>
                <h3 className="text-xl font-medium tracking-[-0.02em] transition-colors group-hover:text-accent-soft sm:text-2xl">
                  {job.role}
                </h3>
                <p className="mt-1 text-white/50">{job.org}</p>
                <ul className="mt-5 space-y-2.5">
                  {job.points.map((p) => (
                    <li key={p} className="flex gap-3 leading-relaxed text-white/70">
                      <span className="mt-[0.7em] h-px w-3 shrink-0 bg-white/25" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="grid gap-3 border-y border-white/[0.08] py-8 sm:grid-cols-[12rem_1fr] sm:gap-10 lg:grid-cols-[14rem_1fr]">
          <span className="label pt-1">Education</span>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="text-lg font-medium tracking-tight">
              {education.degree}
              <span className="text-white/50"> · {education.school}</span>
            </p>
            <span className="font-mono text-xs text-white/50">{education.period}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
