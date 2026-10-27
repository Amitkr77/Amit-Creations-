import { emit } from "./bus";

// Small rewards for exploring. Progress lives in localStorage, per visitor.
export const ACHIEVEMENTS = [
  { id: "terminal", title: "Opened the terminal", hint: "Press ` or Ctrl/⌘ K" },
  { id: "reader", title: "Read three case studies", hint: "Open any three projects" },
  { id: "shapeshifter", title: "Reshaped the particles", hint: "Try `particles galaxy`" },
  { id: "stats", title: "Looked under the hood", hint: "Type `stats` in the terminal" },
  { id: "konami", title: "Entered the Konami code", hint: "↑ ↑ ↓ ↓ ← → ← → B A" },
  { id: "sudo", title: "Tried sudo", hint: "Some commands need sudo…" },
  { id: "explorer", title: "Reached the end", hint: "Scroll all the way down" },
  { id: "console", title: "Said hi from the console", hint: "Developers check DevTools" },
  { id: "lost", title: "Got lost in space", hint: "Visit a page that doesn't exist" },
];

const KEY = "achievements";
const READ_KEY = "case-studies-read";

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage blocked: achievements just won't persist
  }
}

// In-memory copy so unlocks still work (once per load) when storage is blocked
let unlocked = new Set(read(KEY));

export const getUnlocked = () => unlocked;

export function unlock(id) {
  if (unlocked.has(id)) return;
  const achievement = ACHIEVEMENTS.find((a) => a.id === id);
  if (!achievement) return;
  unlocked = new Set(unlocked).add(id);
  write(KEY, [...unlocked]);
  emit("achievement", { ...achievement, count: unlocked.size, total: ACHIEVEMENTS.length });
}

export function trackCaseStudy(name) {
  const seen = new Set(read(READ_KEY)).add(name);
  write(READ_KEY, [...seen]);
  if (seen.size >= 3) unlock("reader");
}
