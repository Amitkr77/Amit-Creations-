import { motion } from 'framer-motion';
import { Shield, Zap, Sparkles, Stars } from 'lucide-react';

const features = [
  {
    title: 'Snappy Performance',
    desc: 'Optimized interactions, buttery animations, and instant feedback everywhere.',
    icon: Zap,
    color: 'from-amber-400 to-rose-500',
  },
  {
    title: 'Secure by Design',
    desc: 'Best practices baked in with sensible defaults and safe patterns.',
    icon: Shield,
    color: 'from-emerald-400 to-cyan-500',
  },
  {
    title: 'Delightful Details',
    desc: 'Micro-interactions, hover states, and empty states that make it feel premium.',
    icon: Sparkles,
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    title: 'Polished Aesthetics',
    desc: 'Clean layouts, tasteful gradients, and adaptive dark mode.',
    icon: Stars,
    color: 'from-sky-400 to-indigo-500',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Interesting, interactive, and effective
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            A curated set of interactions designed to boost engagement and make your product stand out.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <TiltCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({ title, desc, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-5 shadow-sm transition-all hover:shadow-xl hover:shadow-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:shadow-white/5"
    >
      {/* Gradient Orb */}
      <div
        className={`absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gradient-to-tr ${color} opacity-20 blur-3xl`}
      />

      {/* Content */}
      <div className="relative">
        {/* Icon */}
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white dark:from-white/10 dark:to-white/5">
          <Icon size={20} />
        </div>

        {/* Title */}
        <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{title}</h3>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{desc}</p>

        {/* CTA */}
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-700 dark:text-violet-300">
          Learn more
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}