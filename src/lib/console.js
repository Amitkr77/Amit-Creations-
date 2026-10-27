import { site } from "../data/site";
import { unlock } from "./achievements";
import { emit } from "./bus";

const REPO = "https://github.com/Amitkr77/Amit-Creations-";

// A hello for anyone who opens DevTools, plus a tiny `amit` API to play with.
export function greetDevelopers() {
  const art = [
    "   █████  ██   ██",
    "  ██   ██ ██  ██ ",
    "  ███████ █████  ",
    "  ██   ██ ██  ██ ",
    "  ██   ██ ██   ██",
  ].join("\n");

  console.log(`%c${art}`, "color:#a99bff;font-family:monospace;font-size:11px;line-height:1.2");
  console.log(
    "%cHey, fellow developer 👋%c\nCurious how this works? The source is open:\n" +
      REPO +
      "\n\nTry %camit.hello()%c — or press ` on the page for the terminal.",
    "font:600 14px Geist,system-ui;color:#fff",
    "font:12px Geist,system-ui;color:#9a9aa8",
    "font:12px monospace;color:#cfc6ff",
    "font:12px Geist,system-ui;color:#9a9aa8"
  );

  window.amit = {
    hello() {
      unlock("console");
      return `Hi! I'm ${site.name}. Say hello for real: ${site.email}`;
    },
    terminal() {
      emit("terminal:open");
      return "opening…";
    },
    source: REPO,
  };
}
