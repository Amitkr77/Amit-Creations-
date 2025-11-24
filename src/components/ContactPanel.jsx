import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function ContactPanel() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.message.trim().length < 10) e.message = 'Tell us a bit more (min 10 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setTimeout(() => setSent(true), 400);
  };

  return (
    <section id="contact" className="py-16">
      <div className="mx-auto max-w-6xl px-6 grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Left: Content */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-medium text-violet-700 dark:border-white/10 dark:bg-white/10 dark:text-violet-300">
            <MessageCircle size={14} />
            Get in touch
          </span>
          <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            Have an idea? Let's make it interactive.
          </h3>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Share your goals and we'll craft an engaging experience with motion, 3D, and delightful UI patterns.
          </p>

          <ul className="mt-6 space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
            <li>Micro-interactions that reward curiosity</li>
            <li>Responsive, accessible components</li>
            <li>Clean aesthetics with dark mode</li>
          </ul>
        </div>

        {/* Right: Form */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-violet-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                aria-label="Your name"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-violet-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                aria-label="Your email"
              />
            </Field>
          </div>

          <Field label="Message" error={errors.message}>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-violet-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
              aria-label="Your message"
            />
          </Field>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Send message
            </button>

            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm text-emerald-600 dark:text-emerald-400"
                >
                  Thanks! We'll get back to you shortly.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="mt-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}