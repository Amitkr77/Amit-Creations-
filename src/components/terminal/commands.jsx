import { projects } from "../../data/projects";
import { nav, site, stack } from "../../data/site";
import { emit, sceneState } from "../../lib/bus";
import { scrollToId } from "../../lib/scroll";
import { Dim, Ext, Hl, Rows } from "./Output";

export const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

const shapeIndex = { sphere: 0, grid: 1, knot: 2, galaxy: 3 };
const sections = ["top", ...nav.map((n) => n.id)];

function findProject(query) {
  const q = slug(query);
  return q ? projects.find((p) => slug(p.name) === q) ?? projects.find((p) => slug(p.name).startsWith(q)) : null;
}

function setShape(index) {
  sceneState.shape = index;
  sceneState.shapeScrollY = window.scrollY;
  emit("scene:set", true);
  emit("scene:shape");
}

// Each command: run(args, ctx) returns output (JSX/string) or nothing.
// ctx: { close(), clear(), history }
export const commands = {
  help: {
    about: "list available commands",
    run: () => (
      <Rows
        rows={Object.entries(commands)
          .filter(([, c]) => c.about)
          .map(([name, c]) => [name + (c.usage ? ` ${c.usage}` : ""), c.about])}
      />
    ),
  },

  whoami: {
    about: "who builds this",
    run: () => (
      <div className="space-y-1">
        <p>
          <Hl>{site.name}</Hl> — {site.role.toLowerCase()}.
        </p>
        <p className="text-white/60">
          Ships production-grade web apps end to end: React &amp; Next.js frontends, Node &amp; Python
          backends, deployed to the cloud.
        </p>
      </div>
    ),
  },

  ls: {
    about: "list projects, sections or stack",
    usage: "[projects|sections|stack]",
    complete: ["projects", "sections", "stack"],
    run: ([what]) => {
      if (!what) return <p>projects/ &nbsp; sections/ &nbsp; stack/</p>;
      if (what.startsWith("project"))
        return <Rows rows={projects.map((p) => [slug(p.name), p.tagline])} />;
      if (what.startsWith("section")) return <p>{sections.join("  ")}</p>;
      if (what === "stack") return commands.stack.run([]);
      return `ls: ${what}: No such file or directory`;
    },
  },

  open: {
    about: "open a project case study",
    usage: "<project>",
    complete: projects.map((p) => slug(p.name)),
    run: ([name], ctx) => {
      if (!name) return <Dim>usage: open &lt;project&gt; — try `ls projects`</Dim>;
      const project = findProject(name);
      if (!project) return `open: ${name}: project not found`;
      ctx.close();
      setTimeout(() => emit("project:open", project), 250);
      return `opening ${project.name}…`;
    },
  },

  cd: {
    about: "jump to a section",
    usage: "<section>",
    complete: sections,
    run: ([to], ctx) => {
      const id = !to || to === "~" || to === ".." || to === "/" ? "top" : to.replace(/^\/|\/$/g, "");
      if (!sections.includes(id)) return `cd: ${to}: no such section — try \`ls sections\``;
      ctx.close();
      setTimeout(() => scrollToId(id), 200);
    },
  },

  stack: {
    about: "tools and technologies",
    run: () => <Rows rows={stack.map((g) => [g.name.toLowerCase(), g.items.join(", ")])} />,
  },

  particles: {
    about: "control the background",
    usage: "[sphere|grid|knot|galaxy|name|burst|pause|play]",
    complete: [...Object.keys(shapeIndex), "name", "burst", "pause", "play"],
    run: ([arg]) => {
      if (!arg)
        return <Dim>usage: particles [sphere|grid|knot|galaxy|name|burst|pause|play]</Dim>;
      if (arg in shapeIndex) {
        setShape(shapeIndex[arg]);
        return `morphing → ${arg}. scroll to hand control back to the page.`;
      }
      if (arg === "burst") {
        emit("scene:set", true);
        emit("scene:burst");
        return "✦";
      }
      if (arg === "name") {
        sceneState.shape = null;
        scrollToId("top");
        emit("scene:set", true);
        setTimeout(() => emit("scene:intro"), 500);
        return "replaying intro…";
      }
      if (arg === "pause" || arg === "play") {
        emit("scene:set", arg === "play");
        return arg === "play" ? "particles resumed" : "particles paused";
      }
      return `particles: unknown option '${arg}'`;
    },
  },

  contact: {
    about: "how to reach me",
    run: () => (
      <Rows
        rows={[
          ["email", <Ext key="e" href={`mailto:${site.email}`}>{site.email}</Ext>],
          ["github", <Ext key="g" href={site.github}>{site.github.replace("https://", "")}</Ext>],
          ["linkedin", <Ext key="l" href={site.linkedin}>{site.linkedin.replace("https://www.", "")}</Ext>],
        ]}
      />
    ),
  },

  resume: {
    about: "open my résumé",
    run: () => {
      window.open(site.resume, "_blank", "noopener");
      return "opening résumé in a new tab…";
    },
  },

  sudo: {
    about: null, // hidden: try `sudo hire amit`
    run: (args, ctx) => {
      if (args.join(" ").toLowerCase() === "hire amit") {
        setTimeout(() => {
          ctx.close();
          scrollToId("contact");
        }, 1400);
        return (
          <div>
            <Dim>[sudo] password for recruiter: ••••••••</Dim>
            <p className="text-emerald-400">Permission granted. Redirecting to contact…</p>
          </div>
        );
      }
      return `${args[0] ?? "sudo"}: nice try.`;
    },
  },

  neofetch: {
    about: "system info",
    run: () => (
      <div className="flex gap-5">
        <pre className="hidden leading-tight text-accent sm:block">{`   ▄▀▀▄
  █ ◉◉ █
  █ ▄▄ █
   ▀▄▄▀`}</pre>
        <Rows
          rows={[
            ["user", site.name],
            ["role", site.role],
            ["projects", `${projects.length} shipped`],
            ["shell", "amit.sh 1.0"],
            ["renderer", "three.js · custom GLSL"],
            ["uptime", "always building"],
          ]}
        />
      </div>
    ),
  },

  history: {
    about: null,
    run: (_, ctx) => ctx.history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join("\n") || "",
  },

  echo: { about: null, run: (args) => args.join(" ") },
  date: { about: null, run: () => new Date().toString() },
  rm: { about: null, run: () => "rm: permission denied — this portfolio is load-bearing." },
  exit: { about: "close the terminal", run: (_, ctx) => ctx.close() },
  clear: { about: "clear the screen", run: (_, ctx) => ctx.clear() },
};

export const suggestions = ["help", "whoami", "ls projects", "particles galaxy", "neofetch", "sudo hire amit"];

// Tab completion: command names first, then each command's own arguments.
export function complete(input) {
  const parts = input.trimStart().split(/\s+/);
  if (parts.length === 1) {
    const names = Object.keys(commands).filter((c) => commands[c].about !== null && c.startsWith(parts[0]));
    return names.length === 1 ? `${names[0]} ` : null;
  }
  const options = commands[parts[0]]?.complete;
  if (!options) return null;
  const last = parts[parts.length - 1].toLowerCase();
  const matches = options.filter((o) => o.startsWith(last));
  if (matches.length !== 1) return null;
  return [...parts.slice(0, -1), matches[0]].join(" ");
}
