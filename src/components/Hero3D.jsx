import { motion, useScroll, useTransform } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { Sparkles, Code2, Server, ArrowRight, ArrowDown, Github, Linkedin } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FaCube } from 'react-icons/fa6';

// Reusable animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const floatingShape = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      opacity: { duration: 0.6, delay },
      scale: { duration: 0.6, delay },
      y: { duration: 5 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
    },
  },
});

export default function Hero3D() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [splineLoading, setSplineLoading] = useState(true);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSplineLoad = useCallback((spline) => {
    setSplineLoading(false);
    const zoomLevel = 0.45;
    spline.setZoom(zoomLevel);
  }, []);

  // Floating geometric shapes for mobile depth
  const FloatingShapes = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large blurred gradient orbs */}
      <motion.div
        className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-violet-300/30 dark:bg-violet-600/20 blur-3xl"
        {...floatingShape(0)}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-fuchsia-300/25 dark:bg-fuchsia-600/15 blur-3xl"
        {...floatingShape(0.3)}
      />
      <motion.div
        className="absolute top-1/3 right-10 w-40 h-40 rounded-full bg-blue-300/20 dark:bg-blue-500/10 blur-2xl"
        {...floatingShape(0.5)}
      />

      {/* Small geometric shapes */}
      <motion.div
        className="absolute top-[15%] left-[10%] w-8 h-8 rounded-lg border-2 border-violet-400/40 dark:border-violet-500/30 rotate-12"
        {...floatingShape(0.2)}
      />
      <motion.div
        className="absolute top-[25%] right-[15%] w-6 h-6 rounded-full border-2 border-fuchsia-400/40 dark:border-fuchsia-500/30"
        {...floatingShape(0.4)}
      />
      <motion.div
        className="absolute bottom-[30%] left-[20%] w-4 h-4 rounded-sm bg-blue-400/30 dark:bg-blue-500/20 rotate-45"
        {...floatingShape(0.6)}
      />
      <motion.div
        className="absolute bottom-[20%] right-[25%] w-10 h-10 rounded-full border-2 border-emerald-400/30 dark:border-emerald-500/20"
        {...floatingShape(0.8)}
      />
      <motion.div
        className="absolute top-[60%] left-[5%] w-5 h-5 rounded-md bg-violet-400/25 dark:bg-violet-500/15 -rotate-12"
        {...floatingShape(1)}
      />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );

  // Skill card component
  const SkillCard = ({ icon: Icon, label, color, index }) => (
    <motion.div
      className="group relative flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg shadow-black/[0.03] hover:shadow-xl hover:shadow-black/[0.06] dark:bg-slate-800/80 dark:shadow-black/20 border border-black/[0.04] dark:border-white/[0.06] transition-all duration-300 cursor-default"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.06, y: -6 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:to-fuchsia-500/10 dark:group-hover:from-violet-400/5 dark:group-hover:to-fuchsia-400/5 transition-all duration-500" />
      <Icon size={30} className={`${color} transition-transform duration-300 group-hover:scale-110`} />
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
        {label}
      </span>
    </motion.div>
  );

  // Social links for mobile
  const SocialLinks = () => (
    <motion.div
      className="flex items-center justify-center gap-3 mt-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {[
        { icon: Github, href: '#github', label: 'GitHub' },
        { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
      ].map(({ icon: Icon, href, label }) => (
        <motion.a
          key={label}
          href={href}
          aria-label={label}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-black/[0.06] dark:bg-slate-800/70 dark:border-white/[0.08] text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200 hover:scale-110"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon size={18} />
        </motion.a>
      ))}
    </motion.div>
  );

  // Scroll indicator for mobile
  const ScrollIndicator = () => (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        Scroll
      </span>
      <motion.div
        className="w-5 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 flex justify-center pt-1.5"
        animate={{ borderColor: ['rgba(148,163,184,0.4)', 'rgba(139,92,246,0.6)', 'rgba(148,163,184,0.4)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-1 h-1.5 rounded-full bg-violet-500"
          animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );

  if (isDesktop) {
    return (
      <section
        ref={sectionRef}
        className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden"
      >
        {/* 3D Scene */}
        <div className="relative order-2 lg:order-1 h-full hidden lg:block">
          {/* Loading skeleton */}
          {splineLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-slate-900 dark:to-violet-950 flex items-center justify-center">
              <motion.div
                className="flex flex-col items-center gap-3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaCube size={32} className="text-violet-400" />
                <span className="text-sm text-violet-500 font-medium">Loading 3D scene...</span>
              </motion.div>
            </div>
          )}
          <Spline
            scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode"
            onLoad={handleSplineLoad}
            renderOnDemand={true}
            style={{ width: '100%', height: '100%' }}
          />
          {/* Multi-layer gradient overlay for text readability and depth */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent dark:from-slate-900/60 dark:via-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/30 to-transparent dark:from-slate-900/40" />
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-violet-400/30 rounded-tl-lg dark:border-violet-500/20" />
          <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-fuchsia-400/30 rounded-bl-lg dark:border-fuchsia-500/20" />
        </div>

        {/* Content */}
        <motion.div
          style={{ y: contentY, opacity, scale }}
          className="order-1 lg:order-2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 xl:px-20 py-16 lg:py-0 relative"
        >
          {/* Subtle background texture */}
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 w-full max-w-xl mx-auto lg:mx-0"
          >
            {/* Badge */}
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 dark:border-violet-800/60 dark:bg-violet-950/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300"
            >
              <Sparkles size={14} className="text-violet-500 dark:text-violet-400" />
              Interactive 3D portfolio
            </motion.span>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
            >
              Full‑Stack Developer{' '}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
                & 3D Enthusiast
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-6 leading-relaxed text-slate-600 dark:text-slate-300 text-base lg:text-lg max-w-md"
            >
              Building playful, modern web apps end‑to‑end. Specializing in React, Node.js, and immersive 3D web experiences.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-3.5">
              <motion.a
                href="#live"
                className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-4 font-semibold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.02, shadow: '0 20px 40px -8px rgba(139,92,246,0.35)' }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Hover shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">View projects</span>
                <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-7 py-4 font-semibold text-slate-700 transition-all duration-300 hover:bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get in touch
              </motion.a>
            </motion.div>

            {/* Quick stats / social proof */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex items-center gap-8 pt-8 border-t border-slate-200/80 dark:border-slate-700/60"
            >
              {[
                { value: '1+', label: 'Years Exp.' },
                { value: '15+', label: 'Projects' },
                // { value: '30+', label: 'Happy Clients' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
                  <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    );
  }

  // Mobile: Enhanced interactive layout
  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-5 py-16 sm:py-20"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950" />
      <FloatingShapes />

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-md mx-auto w-full"
      >
        {/* Badge */}
        <motion.span
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 dark:border-violet-800/50 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 text-xs font-semibold text-violet-700 dark:text-violet-300 shadow-sm"
        >
          <Sparkles size={14} className="text-violet-500" />
          Interactive 3D Portfolio
        </motion.span>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="mt-7 text-[2.5rem] sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]"
        >
          Full‑Stack
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
            Developer
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-2 text-lg font-medium text-slate-400 dark:text-slate-500"
        >
          & 3D Enthusiast
        </motion.p>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mt-5 leading-relaxed text-slate-600 dark:text-slate-300 text-[0.938rem]"
        >
          Building playful, modern web apps end‑to‑end. Specializing in React, Node.js, and 3D web experiences.
        </motion.p>

        {/* Skill cards */}
        <motion.div variants={itemVariants} className="mt-8 flex justify-center gap-3">
          {[
            { icon: Code2, label: 'React', color: 'text-sky-500' },
            { icon: Server, label: 'Node.js', color: 'text-emerald-500' },
            { icon: FaCube, label: '3D Web', color: 'text-violet-500' },
          ].map((skill, i) => (
            <SkillCard key={skill.label} {...skill} index={i} />
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-col gap-3 w-full max-w-xs mx-auto">
          <motion.a
            href="#live"
            className="group relative inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white shadow-lg shadow-violet-500/25 overflow-hidden"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative z-10">View Projects</span>
            <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
          <motion.a
            href="#features"
            className="inline-flex items-center justify-center gap-2 w-full rounded-2xl border-2 border-slate-200 bg-white/90 backdrop-blur-sm px-8 py-4 font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Social links */}
        <SocialLinks />
      </motion.div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}