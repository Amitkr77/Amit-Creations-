import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { Sparkles, Code2, Server } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { FaCube } from 'react-icons/fa6';

export default function Hero3D() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); 
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSplineLoad = useCallback((spline) => {
    // Optimize zoom for desktop/large screens
    const zoomLevel = 0.45;
    spline.setZoom(zoomLevel);
    // Additional performance tweaks if needed
  }, []);

  if (isDesktop) {
    // Desktop/Large Screen: Keep current 3D layout
    return (
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden">
        {/* 3D Scene */}
        <div className="relative order-2 lg:order-1 h-[50vh] xs:h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-full hidden lg:block">
          <Spline
            scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode"
            onLoad={handleSplineLoad}
            renderOnDemand={true}
            style={{ width: '100%', height: '100%' }}
          />
          {/* Soft gradient overlay */}
          <div className="pointer-events-none absolute inset-0 hidden sm:block bg-gradient-to-t from-white/20 via-transparent to-transparent dark:from-black/40" />
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2 flex flex-col justify-center px-4 py-8 xs:px-6 sm:px-8 lg:px-12 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl mx-auto lg:mx-0"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-medium text-violet-700 dark:border-white/10 dark:bg-white/10 dark:text-violet-300">
              <Sparkles size={14} />
              Interactive 3D portfolio
            </span>

            {/* Title */}
            <h1 className="mt-4 text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Full‑Stack Developer & 3D Enthusiast
            </h1>

            {/* Description */}
            <p className="mt-6 leading-relaxed text-slate-700 dark:text-slate-300 text-sm xs:text-base">
              Building playful, modern web apps end‑to‑end. Specializing in React, Node.js, and 3D web experiences.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#live"
                className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] sm:hover:shadow-xl"
              >
                View projects
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl border border-black/10 bg-white/70 px-6 py-3.5 font-semibold text-slate-800 transition-all duration-200 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Mobile: Alternative user-friendly, interactive layout
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-slate-900 dark:via-slate-800 dark:to-violet-900 px-4 py-12">
      {/* Animated background elements for interactivity */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, staggerChildren: 0.2 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-violet-400 rounded-full opacity-40 dark:bg-violet-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Content - Centered and prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md mx-auto"
      >
        {/* Badge with sparkle animation */}
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-4 py-2 text-sm font-semibold text-violet-700 dark:border-violet-800 dark:bg-slate-800/90 dark:text-violet-300"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Sparkles size={16} className="animate-pulse" />
          Interactive 3D Portfolio
        </motion.span>

        {/* Title - Larger and bold */}
        <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Full‑Stack Developer
          <br />
          <span className="text-violet-600 dark:text-violet-400">& 3D Enthusiast</span>
        </h1>

        {/* Description */}
        <p className="mt-6 leading-relaxed text-slate-600 dark:text-slate-300 text-base">
          Building playful, modern web apps end‑to‑end. Specializing in React, Node.js, and 3D web experiences.
        </p>

        {/* Interactive Skills Icons - Animate on hover */}
        <div className="mt-8 flex justify-center gap-6">
          {[
            { icon: Code2, label: 'React', color: 'text-blue-500' },
            { icon: Server, label: 'Node.js', color: 'text-green-500' },
            { icon: FaCube, label: '3D Web', color: 'text-violet-500' },
          ].map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl dark:bg-slate-800/70 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Icon size={32} className={color} />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons - Stacked and full-width */}
        <div className="mt-10 flex flex-col gap-4 w-full max-w-sm mx-auto">
          <a
            href="#live"
            className="inline-flex items-center justify-center w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl"
          >
            View Projects
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center w-full rounded-xl border-2 border-violet-200 bg-white px-8 py-4 font-bold text-violet-700 transition-all duration-300 hover:bg-violet-50 dark:border-violet-800 dark:bg-slate-800 dark:text-violet-300 dark:hover:bg-slate-700 hover:scale-105 active:scale-95"
          >
            Get In Touch
          </a>
        </div>
      </motion.div>
    </section>
  );
}