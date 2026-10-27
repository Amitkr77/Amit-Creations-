import { stack } from "../data/site";
import { Reveal, SectionHeader, Serif } from "./ui/Reveal";

export default function Stack() {
  return (
    <section id="stack" className="relative py-28 sm:py-40">
      <div className="container-page">
        <SectionHeader
          index="04"
          label="Stack"
          title={
            <>
              Tools I reach for <Serif>every day.</Serif>
            </>
          }
        />

        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-8">
          {stack.map((group, i) => (
            <Reveal key={group.name} delay={i * 0.06}>
              <h3 className="label border-b border-white/[0.08] pb-4">{group.name}</h3>
              <ul className="mt-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-white/[0.05] py-3 text-white/80 transition-colors duration-300 hover:text-accent-soft"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
