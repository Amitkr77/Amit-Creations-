import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { site } from "../data/site";

const CACHE_KEY = "gh-activity";
const CACHE_MS = 30 * 60 * 1000;

async function loadActivity(user) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;
  } catch {
    // ignore unreadable cache
  }

  const [contrib, events] = await Promise.all([
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`).then((r) => (r.ok ? r.json() : null)),
    fetch(`https://api.github.com/users/${user}/events/public?per_page=30`).then((r) => (r.ok ? r.json() : null)),
  ]);

  const push = Array.isArray(events) ? events.find((e) => e.type === "PushEvent") : null;
  const data = {
    days: contrib?.contributions ?? [],
    total: contrib?.total?.lastYear ?? null,
    lastPush: push ? { repo: push.repo.name.split("/")[1], at: push.created_at } : null,
  };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // private mode
  }
  return data;
}

function timeAgo(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  const units = [
    [31536000, "y"],
    [2592000, "mo"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of units) if (s >= secs) return `${Math.floor(s / secs)}${label} ago`;
  return "just now";
}

const formatDay = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const LEVEL = [
  "bg-white/[0.06]",
  "bg-accent/30",
  "bg-accent/55",
  "bg-accent/80 shadow-[0_0_6px_rgba(169,155,255,0.45)]",
  "bg-accent-soft shadow-[0_0_10px_rgba(169,155,255,0.8)]",
];

// Live contribution graph + latest push, pulled from public APIs. Renders nothing if they fail.
export default function GitHubActivity() {
  const [data, setData] = useState(null);
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    let alive = true;
    loadActivity(site.githubUser)
      .then((d) => alive && setData(d))
      .catch(() => alive && setData({ days: [], total: null, lastPush: null }));
    return () => {
      alive = false;
    };
  }, []);

  // Pad the front so the first column starts on a Sunday, like GitHub's own graph
  const cells = useMemo(() => {
    if (!data?.days.length) return [];
    const pad = new Date(`${data.days[0].date}T00:00:00`).getDay();
    return [...Array(pad).fill(null), ...data.days];
  }, [data]);

  if (data && !cells.length && !data.lastPush) return null;

  return (
    <div ref={ref} className="mt-20 rounded-3xl border border-white/[0.08] bg-ink-900/50 p-5 backdrop-blur-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <p className="font-mono text-xs text-white/60">
            {data?.lastPush ? (
              <>
                pushed to <span className="text-white">{data.lastPush.repo}</span> · {timeAgo(data.lastPush.at)}
              </>
            ) : (
              "Live from GitHub"
            )}
          </p>
        </div>
        <p className="font-mono text-xs text-white/45" aria-live="polite">
          {hover
            ? `${hover.count} contribution${hover.count === 1 ? "" : "s"} · ${formatDay(hover.date)}`
            : data?.total != null
              ? `${data.total} contributions in the last year`
              : " "}
        </p>
      </div>

      {cells.length > 0 && (
        <div
          className="mt-6 grid grid-flow-col grid-rows-7 gap-[2px] sm:gap-[3px]"
          style={{ gridAutoColumns: "minmax(0, 1fr)" }}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={`GitHub contribution graph: ${data.total ?? "unknown"} contributions in the last year`}
        >
          {cells.map((day, i) =>
            day ? (
              <span
                key={day.date}
                onPointerEnter={() => setHover(day)}
                className={`aspect-square rounded-[2px] transition-[opacity,transform] duration-700 ease-out hover:scale-150 ${LEVEL[day.level]} ${
                  inView ? "opacity-100" : "scale-50 opacity-0"
                }`}
                style={{ transitionDelay: inView ? `${Math.floor(i / 7) * 14}ms` : "0ms" }}
              />
            ) : (
              <span key={`pad-${i}`} />
            )
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-white/35">
        <a href={site.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
          github.com/{site.githubUser} ↗
        </a>
        <span className="hidden items-center gap-1.5 sm:flex">
          less
          {LEVEL.map((c, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${c}`} />
          ))}
          more
        </span>
      </div>
    </div>
  );
}
