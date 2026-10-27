import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { unlock } from "../lib/achievements";
import { markIntroDone, sceneState } from "../lib/bus";
import { ease } from "../lib/motion";

const Scene = lazy(() => import("./scene/Scene"));

// Lost in space: the particle field drifts as a galaxy behind a way home.
export default function NotFound() {
  useEffect(() => {
    document.title = "Lost in space — Amit Kumar";
    sceneState.shape = 3;
    sceneState.shapeScrollY = 0;
    markIntroDone();
    const t = setTimeout(() => unlock("lost"), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="label text-accent"
        >
          Error 404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.4 }}
          className="mt-5 text-[clamp(3rem,10vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em]"
        >
          Lost in <span className="font-serif font-normal italic text-accent-soft">space.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-6 max-w-sm text-white/55"
        >
          This page drifted out of orbit. The rest of the universe is still where you left it.
        </motion.p>
        <motion.a
          href="/"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease }}
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors hover:bg-accent-soft"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back home
        </motion.a>
        <p className="mt-6 font-mono text-[11px] text-white/35">
          {window.location.pathname}
        </p>
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
