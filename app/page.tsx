import Bio from "@/components/bio";
import Timeline from "@/components/timeline";
import Project from "@/components/project";
import { bio, works, education } from "@/lib/data";
import { projects } from "@/lib/projects";
import Link from "next/link";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Bio Section */}
      <section className="py-6">
        <div className="flex flex-col md:flex-row justify-center items-center mt-5 max-w-6xl mx-auto px-4">

          {/* Picture + Social */}
          <div className="flex flex-col-reverse md:flex-row justify-center items-center space-y-4 md:space-y-0 space-x-0 md:space-x-4">

            {/* Social */}
            <div className="mt-4 md:mt-0 flex justify-center items-center flex-row md:flex-col space-y-0 md:space-y-2 space-x-2 md:space-x-0">
              <a href="mailto:llonchfrank@gmail.com" className="h-10 w-10 rounded-full bg-center bg-cover shadow-md" style={{ backgroundImage: "url('/images/email_icon.png')" }} />
              <a href="https://www.linkedin.com/in/frank-llonch-2b9bb7295/" className="h-10 w-10 rounded-full bg-center bg-cover shadow-md" style={{ backgroundImage: "url('/images/linkedin_logo_sq.png')" }} />
              <a href="https://github.com/frankllonch" className="h-10 w-10 rounded-full bg-center bg-cover shadow-md" style={{ backgroundImage: "url('/images/github_logo.png')" }} />
            </div>

            {/* Profile Photo */}
            <div
              className="h-56 w-56 rounded-full bg-center bg-cover shadow-md"
              style={{ backgroundImage: "url('/images/yourphoto.jpg')" }}
            />
          </div>

          {/* Bio Text */}
          <div className="max-w-md px-4 mt-6 md:mt-0 ml-0 md:ml-5 text-sm">
            <Bio {...bio} />
          </div>

        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-6 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl text-center mb-2">These are some of my projects:</h1>

        <p className="text-sm text-center text-gray-600">(Click any project to get more info)</p>

        <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {projects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <Project {...project} />
            </Link>
          ))}
        </div>

      </section>

      {/* Work Experience */}
      <section className="py-5 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl text-center">Work Experience</h1>
        <Timeline items={works} />
      </section>

      {/* Education */}
      <section className="py-5 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl text-center">Education</h1>
        <Timeline items={education} />
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>Frank Llonch © {currentYear}</p>
      </footer>

    </main>
  );
}