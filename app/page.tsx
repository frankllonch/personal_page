import Section from "@/components/section";
import ProjectBox from "@/components/project-box";
import EntryBox from "@/components/entry-box";
import ScrambledText from "@/components/wierdtext";
import { projects } from "@/lib/projects";
import { site, works, education } from "@/lib/data";

/**
 * One page, top to bottom: a statement, the projects, where I have worked,
 * where I have studied, how to reach me. Everything on it is text in a
 * hairline grid; the only motion is the scramble on hover.
 */
export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className="mx-auto max-w-[1600px] px-4 sm:px-6 pt-12">
      {/* STATEMENT */}
      <section className="pt-10 sm:pt-16 pb-14 sm:pb-20">
        <h1 className="font-bold tracking-tight leading-[1.04] text-[clamp(1.55rem,3.6vw,3.3rem)] max-w-[30ch]">
          <ScrambledText radius={60} duration={0.6} speed={0.4} scrambleChars="*">
            {site.statement}
          </ScrambledText>
        </h1>
        <dl className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
          {site.facts.map((f) => (
            <div key={f.label} className="rule pt-2">
              <dt className="label soft">{f.label}</dt>
              <dd className="mt-1 text-[15px] leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* PROJECTS */}
      <Section id="projects" index="01" title="Projects">
        <div className="boxes grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p, i) => (
            <ProjectBox key={p.slug} project={p} index={i} />
          ))}
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" index="02" title="Experience">
        <div className="boxes grid-cols-1 sm:grid-cols-3">
          {works.map((w) => (
            <EntryBox key={w.name} entry={w} />
          ))}
        </div>
      </Section>

      {/* EDUCATION */}
      <Section id="education" index="03" title="Education">
        <div className="boxes grid-cols-1 sm:grid-cols-3">
          {education.map((e) => (
            <EntryBox key={e.name} entry={e} />
          ))}
        </div>
      </Section>

      {/* CONTACT / COLOPHON */}
      <footer id="contact" className="rule pt-3 pb-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="label soft">Contact</div>
          <a href={`mailto:${site.email}`} className="mt-2 block font-bold text-[clamp(1.1rem,2.2vw,1.9rem)] tracking-tight">
            <ScrambledText radius={40} duration={0.5} speed={0.5} scrambleChars="*">
              {site.email}
            </ScrambledText>
          </a>
        </div>
        <div>
          <div className="label soft">Elsewhere</div>
          <ul className="mt-2 space-y-1 text-[15px]">
            {site.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target={l.href.startsWith("/") || l.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer">
                  <ScrambledText radius={20} duration={0.4} speed={0.5} scrambleChars="*">
                    {l.label}
                  </ScrambledText>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-[15px] leading-snug soft md:text-right">
          <p>
            © {year} {site.name}.{" "}
            <a href="https://github.com/frankllonch/personal_page" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Source</a>
            {" · "}
            <a href="https://gabrielferrate.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">After gabrielferrate.com</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
