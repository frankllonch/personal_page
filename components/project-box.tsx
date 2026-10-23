import ScrambledText from "@/components/wierdtext";
import type { Project } from "@/lib/projects";

const STATUS: Record<NonNullable<Project["status"]>, string> = {
  new: "New",
  upcoming: "Upcoming",
};

/** One project in the hairline grid. */
export default function ProjectBox({ project, index }: { project: Project; index: number }) {
  return (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="box">
      <div className="flex items-baseline justify-between label soft">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{project.status ? STATUS[project.status] : project.year}</span>
      </div>
      <h3 className="mt-6 mb-3 font-bold text-2xl sm:text-[1.7rem] leading-[1.05] tracking-tight">
        <ScrambledText radius={40} duration={0.5} speed={0.5} scrambleChars="*">
          {project.title}
        </ScrambledText>
      </h3>
      <p className="text-[15px] leading-snug max-w-[34ch]">{project.description}</p>
      <div className="mt-auto pt-6 flex items-end justify-between gap-4 label soft">
        <span>{project.tags.join("  ·  ")}</span>
        <span aria-hidden="true" className="box-arrow">↗</span>
      </div>
    </a>
  );
}
