import { motion } from "framer-motion";
import { Code2, Sparkles, ExternalLink, Github } from "lucide-react";

function ProjectCard({ project, onOpen }) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative w-full text-left rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient glow on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity`}
      />

      <div className="p-5">
        {/* Project Image Preview */}
        <div className="mb-3 h-32 w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Code2 className="w-9 h-9 text-slate-500 dark:text-slate-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 line-clamp-1">
          {project.title}
        </h3>

        {/* One-liner */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Tech badges (max 4) */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tech.slice(0, 4).map((t, i) => (
            <span
              key={i}
              className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Live & GitHub Links */}
        <div className="flex items-center gap-3 mb-3">
          {project.liveUrl && project.liveUrl !== "#" && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
          )}
          {project.githubUrl && project.githubUrl !== "#" && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:underline"
            >
              <Github className="w-3.5 h-3.5" />
              Source
            </a>
          )}
        </div>

        {/* View Case Study */}
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span>View case study</span>
          <Sparkles className="w-3 h-3 animate-pulse" />
        </div>
      </div>
    </motion.button>
  );
}

export default ProjectCard;