import { ArrowUpRight } from "lucide-react";

export default function ProjectLinks({ project, className = "" }) {
  return (
    <div className={`flex items-center gap-5 text-sm ${className}`}>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} live site`}
          className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white"
        >
          Live <ArrowUpRight size={14} />
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} source code`}
          className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white"
        >
          Code <ArrowUpRight size={14} />
        </a>
      )}
    </div>
  );
}
