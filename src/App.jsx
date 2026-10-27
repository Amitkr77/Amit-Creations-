import { Component, lazy, Suspense, useCallback, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { initSmoothScroll } from "./lib/scroll";
import { markIntroDone, on } from "./lib/bus";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Work from "./components/work/Work";
import About from "./components/About";
import Stack from "./components/Stack";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import KeyboardEasterEggs from "./components/KeyboardEasterEggs";
import Terminal from "./components/terminal/Terminal";

// Three.js loads in its own chunk so text paints first
const Scene = lazy(() => import("./components/scene/Scene"));

// No WebGL (or a lost context) shouldn't take the page down with it
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    markIntroDone();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function App() {
  const [sceneOn, setSceneOn] = useState(true);

  useEffect(() => initSmoothScroll(), []);

  // The hero waits for the particle intro; never let a slow or missing scene hold it hostage
  useEffect(() => {
    const t = setTimeout(markIntroDone, 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => on("scene:set", (value) => setSceneOn(value)), []);

  const toggleScene = useCallback(() => setSceneOn((v) => !v), []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#work"
        className="sr-only z-[70] rounded-full bg-white px-4 py-2 text-sm text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <SceneBoundary>
        <Suspense fallback={null}>
          <Scene active={sceneOn} />
        </Suspense>
      </SceneBoundary>

      {/* Soft vignette keeps text crisp over the particles */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,10,0.65)_100%)]"
      />

      <Navbar />
      <main className="relative z-10 overflow-x-clip">
        <Hero />
        <Work />
        <About />
        <Stack />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>

      <KeyboardEasterEggs sceneOn={sceneOn} onToggleScene={toggleScene} />
      <Terminal />
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  );
}
