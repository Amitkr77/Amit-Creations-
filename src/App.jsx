import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Code2,
  Zap,
  Heart,
  Sparkles,
  Terminal,
  Globe,
  Palette,
  Database,
  GitBranch,
  Cloud,
  Settings,
  Cpu,
  FileCode,
  Monitor,
  PenTool,
  Wrench,
  Layers,
  Server,
  Package,
  Linkedin,
  Mail,
  Github,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Hero3D from "./components/Hero3D";
import FeatureGrid from "./components/FeatureGrid";
import ContactPanel from "./components/ContactPanel";
import ParticleBackground from "./components/ParticleBackground";
import KeyboardEasterEggs from "./components/KeyboardEasterEggs";
import ProjectSection from "./components/ProjectSection";

/* ========================================
   LIVE SECTION COMPONENT
   ======================================== */
function LiveSection() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Hey there, I'm live and building!";

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i++));
      } else {
        clearInterval(id);
      }
    }, 70);
    return () => clearInterval(id);
  }, []);

  const skillCategories = [
    {
      name: "Frontend",
      icon: <Monitor className="w-5 h-5" />,
      gradient: "from-cyan-400 to-blue-600",
      skills: [
        { name: "React.js", icon: <Layers className="w-4 h-4" /> },
        { name: "Next.js", icon: <FileCode className="w-4 h-4" /> },
        { name: "Vite", icon: <Zap className="w-4 h-4" /> },
        { name: "Tailwind CSS", icon: <Palette className="w-4 h-4" /> },
        { name: "Framer Motion", icon: <Sparkles className="w-4 h-4" /> },
        { name: "JavaScript", icon: <FileCode className="w-4 h-4" /> },
        { name: "HTML5", icon: <Code2 className="w-4 h-4" /> },
      ],
    },
    {
      name: "Backend",
      icon: <Server className="w-5 h-5" />,
      gradient: "from-emerald-400 to-teal-600",
      skills: [
        { name: "FastAPI", icon: <Cpu className="w-4 h-4" /> },
        { name: "Node.js", icon: <Terminal className="w-4 h-4" /> },
        { name: "Express", icon: <Package className="w-4 h-4" /> },
        { name: "Python", icon: <Globe className="w-4 h-4" /> },
        { name: "REST APIs", icon: <Wrench className="w-4 h-4" /> },
        { name: "JWT", icon: <Settings className="w-4 h-4" /> },
        { name: "Cookies", icon: <Package className="w-4 h-4" /> },
      ],
    },
    {
      name: "Database",
      icon: <Database className="w-5 h-5" />,
      gradient: "from-amber-400 to-orange-600",
      skills: [
        { name: "MongoDB", icon: <Database className="w-4 h-4" /> },
        { name: "MySQL", icon: <Server className="w-4 h-4" /> },
      ],
    },
    {
      name: "Tools & DevOps",
      icon: <Wrench className="w-5 h-5" />,
      gradient: "from-purple-400 to-pink-600",
      skills: [
        { name: "Git", icon: <GitBranch className="w-4 h-4" /> },
        { name: "GitHub", icon: <GitBranch className="w-4 h-4" /> },
        { name: "Docker", icon: <Package className="w-4 h-4" /> },
        { name: "Vercel", icon: <Cloud className="w-4 h-4" /> },
        { name: "GCP", icon: <Cloud className="w-4 h-4" /> },
        { name: "CI/CD", icon: <Settings className="w-4 h-4" /> },
        { name: "VS Code", icon: <Monitor className="w-4 h-4" /> },
        { name: "Postman", icon: <Wrench className="w-4 h-4" /> },
        { name: "Figma", icon: <PenTool className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <section id="live" className="py-20 ">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
            Live & Building
          </h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Turning ideas into production reality — in real time.
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-cyan-400/20 blur-3xl opacity-50 dark:opacity-30" />

          <div className="relative rounded-3xl border border-black/5 bg-white/75 p-8 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 dark:border-white/10 dark:bg-white/5">
            {/* Greeting */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
              >
                <User className="w-6 h-6" />
              </motion.div>
              <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  {typedText}
                </span>
                <span className="animate-pulse">|</span>
              </p>
            </div>

            {/* Intro */}
            <p className="text-lg  text-slate-700 dark:text-slate-200 mb-8 space-y-3">
              <span className="block">
                I’m a{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  full-stack engineer
                </span>{" "}
                who ships{" "}
                <span className="italic underline decoration-wavy decoration-teal-400">
                  high-impact, production-grade web apps
                </span>{" "}
                — from the first spark of an idea to scalable cloud deployment.
              </span>

              <span className="block mt-3">
                I blend{" "}
                <span className="font-medium text-cyan-600 dark:text-cyan-400">
                  elegant, accessible frontends
                </span>{" "}
                with{" "}
                <span className="font-medium text-teal-600 dark:text-teal-400">
                  robust, secure backends
                </span>
                , ensuring every pixel and API call is intentional, performant,
                and user-obsessed.
              </span>

              <span className="block mt-3">
                Whether it’s real-time dashboards, AI-powered tools, or seamless
                e-commerce flows — I build systems that{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  scale gracefully
                </span>{" "}
                and{" "}
                <span className="font-semibold text-pink-600 dark:text-pink-400">
                  delight users
                </span>
                .
              </span>
            </p>

            {/* 3 Feature Cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-10">
              {[
                {
                  title: "Craft",
                  icon: <Sparkles className="w-5 h-5" />,
                  bg: "from-emerald-50 to-teal-50",
                  border: "border-emerald-200/50",
                  darkBg: "dark:from-emerald-900/20 dark:to-teal-900/20",
                  darkBorder: "dark:border-emerald-800/50",
                  text: "Pixel-perfect UIs with React + Tailwind. Fast. Accessible. Delightful.",
                },
                {
                  title: "Build",
                  icon: <Zap className="w-5 h-5" />,
                  bg: "from-teal-50 to-cyan-50",
                  border: "border-teal-200/50",
                  darkBg: "dark:from-teal-900/20 dark:to-cyan-900/20",
                  darkBorder: "dark:border-teal-800/50",
                  text: "Scalable APIs with Node.js & Python. Cloud-native, secure, real-time.",
                },
                {
                  title: "Ship",
                  icon: <Heart className="w-5 h-5 animate-pulse" />,
                  bg: "from-cyan-50 to-blue-50",
                  border: "border-cyan-200/50",
                  darkBg: "dark:from-cyan-900/20 dark:to-blue-900/20",
                  darkBorder: "dark:border-cyan-800/50",
                  text: "Features users love. Performance. DX. Accessibility. Always.",
                },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className={`rounded-2xl bg-gradient-to-br ${c.bg} ${c.darkBg} p-6 border ${c.border} ${c.darkBorder}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-white/30 dark:bg-white/10">
                      {c.icon}
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {c.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {c.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Skill Categories */}
            <div className=" grid gap-6 md:grid-cols-4 mb-2 items-start ">
              {skillCategories.map((cat, catIdx) => (
                <motion.div
                  className=" border p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border-black/5 dark:border-white/10 shadow-sm"
                  key={catIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.gradient} text-white`}
                    >
                      {cat.icon}
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 ">
                    {cat.skills.map((skill, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r ${cat.gradient} shadow-sm`}
                      >
                        {skill.icon}
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Live Status */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className=" flex items-center gap-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inset-0 rounded-full bg-emerald-500"></span>
              </span>
              <span>Currently crafting something new...</span>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600 dark:text-slate-400">
            Want to build something together?{" "}
            <a
              href="#contact"
              className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Let’s talk
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ========================================
   MAIN APP
   ======================================== */
export default function App() {
  const [dark, setDark] = useState(true);
  const [particlesOn, setParticlesOn] = useState(true);
  const [burst, setBurst] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const triggerBurst = () => setBurst((b) => b + 1);

  // Smooth scroll for # links
  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handler = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href");
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: "smooth" });
    };
    anchors.forEach((a) => a.addEventListener("click", handler));
    return () =>
      anchors.forEach((a) => a.removeEventListener("click", handler));
  }, []);

  return (
    <div className={dark ? "dark" : ""}>
      <ParticleBackground enabled={particlesOn} burstSignal={burst} />

      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-900 selection:bg-violet-500/20 selection:text-violet-900 dark:selection:text-violet-100">
        <Navbar dark={dark} onToggleTheme={() => setDark((d) => !d)} />

        <KeyboardEasterEggs
          onToggleParticles={() => setParticlesOn((v) => !v)}
          onKonami={triggerBurst}
          onHelp={() => setShowShortcuts((s) => !s)}
        />

        {/* Help Modal */}
        {showShortcuts && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
            onClick={() => setShowShortcuts(false)}
          >
            <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-6 text-slate-100 shadow-xl">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  <kbd className="font-medium">P</kbd> — Toggle particle
                  background
                </li>
                <li>
                  <kbd className="font-medium">?</kbd> — Toggle this help
                </li>
                <li>
                  <kbd className="font-medium">Konami Code</kbd> — Trigger a
                  celebratory burst
                </li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                Tip: The hero 3D scene is fully interactive — drag & click!
              </p>
            </div>
          </div>
        )}

        <main className="overflow-x-hidden">
          <Hero3D />
          <LiveSection />
          <ProjectSection />
          <FeatureGrid />
          <ContactPanel />

          <footer className="relative py-8 overflow-hidden bg-gradient-to-t from-white to-slate-50 dark:from-black dark:to-slate-950">
            <div className="container mx-auto px-6 max-w-7xl text-center">
              {/* Subtle animated glow (optional) */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent animate-pulse" />

              {/* Interactive easter-egg */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBurst((b) => b + 1)} // reuse your particle burst
                className="mt-2 text-xs text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Sparkles className="inline-block w-3 h-3 mr-1" />
                Click for a tiny surprise
              </motion.button>

              <div className="flex items-center gap-4 mt-6 w-full   justify-between">
                {" "}
                {/* Optional social icons (tiny) */}
                <div className="flex items-center justify-center gap-4">
                  {[
                    { Icon: Github, href: "https://github.com/Amitkr77" },
                    {
                      Icon: Linkedin,
                      href: "https://linkedin.com/in/Amitkr77",
                    },
                    { Icon: Mail, href: "mailto:amitroyk99@gmail.com" },
                  ].map(({ Icon, href }, i) => (
                    <motion.a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      className="text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    Built with{" "}
                    <Heart className="inline-block w-3.5 h-3.5 animate-pulse text-red-500" />{" "}
                    & passion
                  </span>{" "}
                  by me © {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
