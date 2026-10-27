// Maps page scroll to a continuous stage value: 0 hero → 1 work → 2 about → 3 contact.
// The morph into the next stage happens over the last ~60% of a viewport before its section.

export const STAGE_SECTIONS = ["top", "work", "about", "contact"];

const smooth = (x) => x * x * (3 - 2 * x);

export function readScrollStage() {
  const vh = window.innerHeight;
  const probe = window.scrollY + vh * 0.55;
  const tops = STAGE_SECTIONS.map((id) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
  });

  let i = 0;
  while (i < tops.length - 1 && tops[i + 1] <= probe) i++;
  if (i === tops.length - 1) return i;

  const window_ = vh * 0.6;
  const f = Math.min(1, Math.max(0, (probe - (tops[i + 1] - window_)) / window_));
  return i + smooth(f);
}

// Sample a per-stage value array at a fractional stage.
export function atStage(values, stage) {
  const i = Math.min(Math.floor(stage), values.length - 2);
  const f = stage - i;
  return values[i] + (values[i + 1] - values[i]) * f;
}
