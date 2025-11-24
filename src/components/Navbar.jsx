import { useEffect } from "react";
import {
  Rocket,
  Sun,
  Moon,
  Github,
  Linkedin,
  Download,
  Terminal,
} from "lucide-react";

export default function Navbar({ dark }) {
  // Sync dark mode with document root
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center w-9 font-mono text-lg px-1 bg-white">
            <span className="font-extrabold">{">"}</span>
            <span className="animate-pulse font-extrabold ml-1"> _</span>
          </div>
          <span className="font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            DVLPR
          </span>
        </div>

        {/* Actions: LinkedIn + GitHub + Resume */}
        <div className="flex items-center gap-2">
          {/* LinkedIn Button */}
          <a
            href="https://www.linkedin.com/in/amitkr77"
            target="_blank"
            rel="noreferrer"
            className="sm:inline-flex hidden items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/20 dark:bg-white/10 bg-white/70"
          >
            <Linkedin size={16} />
          </a>

          {/* GitHub Button */}
          <a
            href="https://github.com/amitkr77"
            target="_blank"
            rel="noreferrer"
            className="sm:inline-flex hidden items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/20 dark:bg-white/10 bg-white/70"
          >
            <Github size={16} />
          </a>

          {/* Resume Download Button */}
          <a
            href="https://drive.google.com/file/d/1yReYdGqcofK2wyal1L7b31stsPEX5eFR/view"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/20 dark:bg-white/10 bg-white/70"
          >
            <Download size={16} />
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}