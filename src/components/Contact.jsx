import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Copy, Loader2 } from "lucide-react";
import { site } from "../data/site";
import Magnetic from "./ui/Magnetic";
import { Reveal, SectionHeader, Serif } from "./ui/Reveal";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const EMPTY = { name: "", email: "", message: "" };

function validate(form) {
  const e = {};
  if (!form.name.trim()) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email.";
  if (form.message.trim().length < 10) e.message = "A little more detail, please (10+ characters).";
  return e;
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    if (!WEB3FORMS_KEY) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio message from ${form.name}`,
          from_name: "Portfolio contact form",
          botcheck: e.target.botcheck.checked,
          ...form,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section id="contact" className="relative py-28 sm:py-40">
      <div className="container-page">
        <SectionHeader
          index="05"
          label="Contact"
          title={
            <>
              Have an idea? <Serif>Let&apos;s build it.</Serif>
            </>
          }
        />

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal as="p" className="max-w-sm leading-relaxed text-white/60">
              A project, a role, or just a question about the web — my inbox is open. Tell me what
              you&apos;re building.
            </Reveal>

            <Reveal delay={0.06} className="mt-10">
              <p className="label">Email</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline break-all text-xl tracking-tight text-white sm:text-2xl"
                >
                  {site.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
                <span aria-live="polite" className="sr-only">
                  {copied ? "Email copied" : ""}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <p className="label">Elsewhere</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {[
                  ["GitHub", site.github],
                  ["LinkedIn", site.linkedin],
                  ["Résumé", site.resume],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white"
                    >
                      {label} <ArrowUpRight size={14} />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-3xl border border-white/[0.08] bg-ink-900/60 p-5 backdrop-blur-md sm:p-8"
            >
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Name" error={errors.name}>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={update("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClass}
                  />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={update("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field id="message" label="Message" error={errors.message} className="mt-5">
                <textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={update("message")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Magnetic className="w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors hover:bg-accent-soft disabled:opacity-60 sm:w-auto"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </Magnetic>

                <div aria-live="polite" className="text-sm">
                  <AnimatePresence mode="wait">
                    {status === "sent" && (
                      <motion.p key="sent" {...statusAnim} className="text-emerald-400">
                        Thanks — your message is in. I&apos;ll reply soon.
                      </motion.p>
                    )}
                    {status === "error" && (
                      <motion.p key="error" {...statusAnim} className="text-rose-400">
                        Couldn&apos;t send right now. Please email{" "}
                        <a href={`mailto:${site.email}`} className="underline">
                          {site.email}
                        </a>
                        .
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent/70 focus:bg-white/[0.05] aria-[invalid=true]:border-rose-400/60";

const statusAnim = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

function Field({ id, label, error, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm text-white/60">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-xs text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
