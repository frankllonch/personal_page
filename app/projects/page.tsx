import { projects } from "@/lib/projects";
import Project from "@/components/project";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold text-center">My Projects</h1>
      <p className="text-center text-gray-600 mt-2">(Click any project)</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {projects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`}>
            <Project {...project} />
          </Link>
        ))}
      </div>

    </main>
  );
}