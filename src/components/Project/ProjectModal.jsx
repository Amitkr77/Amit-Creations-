import React from "react";
import { motion } from "framer-motion";
import { Globe, GitBranch, Heart, Layers, Wrench, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProjectModal({ project, onClose }) {
  const slides = [
    {
      title: "Overview",
      icon: <Globe className="w-5 h-5" />,
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {project.description}
        </p>
      ),
    },
    {
      title: "The Challenge",
      icon: <Zap className="w-5 h-5" />,
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {project.challenge ||
            "Deliver a high-performance, real-time experience while keeping the codebase maintainable and the UI accessible."}
        </p>
      ),
    },
    {
      title: "Solution",
      icon: <Wrench className="w-5 h-5" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
          {project.solution?.map((s, i) => <li key={i}>{s}</li>) || (
            <>
              <li>React + TypeScript for a type-safe UI layer</li>
              <li>FastAPI + WebSockets for low-latency data</li>
              <li>Docker + CI/CD for one-click deploys</li>
            </>
          )}
        </ul>
      ),
    },
    {
      title: "Tech Stack",
      icon: <Layers className="w-5 h-5" />,
      content: (
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <span
              key={i}
              className={`rounded-full px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r ${project.gradient}`}
            >
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Results",
      icon: <Heart className="w-5 h-5" />,
      content: (
        <div className="space-y-2 text-slate-600 dark:text-slate-300">
          {project.results?.map((r, i) => <p key={i}>• {r}</p>) || (
            <>
              <p>• 3× faster page loads</p>
              <p>• 99.9 % uptime in production</p>
              <p>• 200 + active daily users</p>
            </>
          )}
        </div>
      ),
    },
  ];

  const [slideIdx, setSlideIdx] = useState(0);

  // Close on Escape
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-white/90 dark:bg-slate-900/95 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 transition"
        >
          <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">
            {project.title}
          </h2>
          <div className="mt-2 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <Globe className="w-4 h-4" />
              Live Demo
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <GitBranch className="w-4 h-4" />
              Source
            </a>
          </div>
        </div>

        {/* Slides */}
        <div className="grid gap-8 md:grid-cols-5">
          {/* Sidebar navigation */}
          <div className="md:col-span-1 space-y-2">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                  slideIdx === i
                    ? "bg-gradient-to-r text-white shadow-md"
                    : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                } ${slideIdx === i ? project.gradient : ""}`}
              >
                {s.icon}
                <span className="text-sm font-medium">{s.title}</span>
              </button>
            ))}
          </div>

          {/* Slide content */}
          <div className="md:col-span-4">
            <motion.div
              key={slideIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="prose prose-slate dark:prose-invert max-w-none"
            >
              <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                {slides[slideIdx].icon}
                {slides[slideIdx].title}
              </h3>
              {slides[slideIdx].content}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
