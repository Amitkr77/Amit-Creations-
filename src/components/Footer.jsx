import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { unlock } from "../lib/achievements";
import { site } from "../data/site";

export default function Footer() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && unlock("explorer"));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={ref} className="relative border-t border-white/[0.08]">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Designed &amp; built by hand.
        </p>
        <div className="flex items-center gap-6">
          <a href={site.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
            LinkedIn
          </a>
          <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
      <p className="container-page hidden pb-6 font-mono text-[11px] text-white/25 sm:block">
        Press <kbd className="text-white/45">`</kbd> or <kbd className="text-white/45">?</kbd> to open the terminal
      </p>
    </footer>
  );
}
