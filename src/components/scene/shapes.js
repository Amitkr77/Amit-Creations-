// Target formations for the particle field, one per page stage.
// Every array has `count` points so the vertex shader can morph between them by index.

const TAU = Math.PI * 2;
const rand = () => Math.random() - 0.5;

export function buildShapes(count) {
  const sphere = new Float32Array(count * 3);
  const terrain = new Float32Array(count * 3);
  const knot = new Float32Array(count * 3);
  const galaxy = new Float32Array(count * 3);
  const random = new Float32Array(count * 2);

  const golden = Math.PI * (3 - Math.sqrt(5));
  const cols = Math.ceil(Math.sqrt(count * 2.4));
  const rows = Math.ceil(count / cols);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 0 · Hero — evenly distributed fibonacci sphere with a slightly fuzzy shell
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const r = 1.85 + rand() * 0.07;
    sphere[i3] = Math.cos(theta) * ring * r;
    sphere[i3 + 1] = y * r;
    sphere[i3 + 2] = Math.sin(theta) * ring * r;

    // 1 · Work — a wide undulating grid that recedes to the horizon
    const gx = ((i % cols) / (cols - 1) - 0.5) * 18;
    const gz = -10 + (Math.floor(i / cols) / (rows - 1)) * 12;
    terrain[i3] = gx + rand() * 0.04;
    terrain[i3 + 1] = -2 + Math.sin(gx * 0.35) * 0.45 + Math.cos(gz * 0.45) * 0.3;
    terrain[i3 + 2] = gz;

    // 2 · About — (2,3) torus knot with a soft volumetric tube
    const t = Math.random() * TAU;
    const kr = Math.cos(3 * t) + 2;
    let ox = rand(), oy = rand(), oz = rand();
    const ol = Math.hypot(ox, oy, oz) || 1;
    const tube = 0.34 * Math.cbrt(Math.random());
    knot[i3] = (kr * Math.cos(2 * t) + (ox / ol) * tube * 1.6) * 0.62;
    knot[i3 + 1] = (kr * Math.sin(2 * t) + (oy / ol) * tube * 1.6) * 0.62;
    knot[i3 + 2] = (-Math.sin(3 * t) + (oz / ol) * tube * 1.6) * 0.62;

    // 3 · Contact — three-armed spiral galaxy in the xz-plane (tilted in the shader)
    const gr = Math.pow(Math.random(), 0.75) * 4.6;
    const arm = ((i % 3) / 3) * TAU;
    const curl = gr * 0.85;
    const spread = 0.55 * (1 - (gr / 4.6) * 0.5);
    const sx = Math.pow(Math.random(), 3) * Math.sign(rand()) * spread;
    const sy = Math.pow(Math.random(), 3) * Math.sign(rand()) * spread * 0.35;
    const sz = Math.pow(Math.random(), 3) * Math.sign(rand()) * spread;
    galaxy[i3] = Math.cos(arm + curl) * gr + sx;
    galaxy[i3 + 1] = sy;
    galaxy[i3 + 2] = Math.sin(arm + curl) * gr + sz;

    random[i * 2] = Math.random();
    random[i * 2 + 1] = Math.random();
  }

  return { sphere, terrain, knot, galaxy, random };
}
