// Tiny pub/sub plus shared state, so DOM components and the WebGL scene can talk
// without threading props through the whole tree.

const listeners = new Map();

export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => listeners.get(event).delete(fn);
}

export function emit(event, payload) {
  listeners.get(event)?.forEach((fn) => fn(payload));
}

// Read every frame by the particle field.
export const sceneState = {
  accent: null, // hex colour of the hovered project
  focusEl: null, // element the particles gather around
  shape: null, // stage index forced from the terminal
  shapeScrollY: 0, // scroll position when `shape` was set; scrolling away clears it
  introDone: false,
  // Written by the scene, shown in the stats panel
  stats: { fps: 0, particles: 0, dpr: 1, renderer: "" },
  // Live tweaks from the stats panel
  tweak: { size: 1, noise: 1, speed: 1, accent: null },
};

export function focusProject(project, el = null) {
  sceneState.accent = project.accent ?? null;
  sceneState.focusEl = el;
  emit("scene:accent");
}

export function clearProjectFocus() {
  sceneState.accent = null;
  sceneState.focusEl = null;
  emit("scene:accent");
}

export function markIntroDone() {
  if (sceneState.introDone) return;
  sceneState.introDone = true;
  emit("intro:done");
}
