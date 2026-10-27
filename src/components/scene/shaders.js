// 3D simplex noise — Ashima Arts / Stefan Gustavson (MIT).
const simplex = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uStage;
uniform float uSpin;
uniform float uPixelRatio;
uniform float uSize;
uniform float uOpacity;
uniform float uBurst;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform vec3 uColorA;
uniform vec3 uColorB;

attribute vec3 aTerrain;
attribute vec3 aKnot;
attribute vec3 aGalaxy;
attribute vec2 aRandom;

varying vec3 vColor;
varying float vAlpha;

${simplex}

vec2 rot(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

vec3 pick(float i, vec3 a, vec3 b, vec3 c, vec3 d) {
  return i < 0.5 ? a : i < 1.5 ? b : i < 2.5 ? c : d;
}

void main() {
  // Stage formations (position attribute holds the hero sphere)
  vec3 s0 = position;
  s0.xz = rot(s0.xz, uSpin);

  vec3 s1 = aTerrain;
  s1.y += sin(s1.x * 0.7 + uTime * 0.5) * 0.2 + cos(s1.z * 0.9 + uTime * 0.35) * 0.16;

  vec3 s2 = aKnot;
  s2.xz = rot(s2.xz, uSpin * 0.8);

  vec3 s3 = aGalaxy;
  s3.xz = rot(s3.xz, uSpin * 0.5);
  s3.yz = rot(s3.yz, 0.95);

  // Staggered morph: each particle leaves at its own moment
  float seg = min(floor(uStage), 2.0);
  float f = clamp(uStage - seg, 0.0, 1.0);
  float delay = aRandom.x * 0.35;
  float t = smoothstep(delay, delay + 0.65, f);
  vec3 pos = mix(pick(seg, s0, s1, s2, s3), pick(seg + 1.0, s0, s1, s2, s3), t);

  // Organic drift, swelling mid-transition
  float swirl = sin(t * 3.14159);
  vec3 np = pos * 0.45 + vec3(uTime * 0.07);
  pos += vec3(snoise(np), snoise(np + 17.3), snoise(np + 41.7)) * (0.05 + swirl * 0.55);

  pos += normalize(pos + 1e-4) * uBurst * (0.6 + aRandom.y * 2.6);

  // Cursor repulsion in world space
  vec4 world = modelMatrix * vec4(pos, 1.0);
  vec2 away = world.xy - uMouse;
  float push = (1.0 - smoothstep(0.0, 1.5, length(away))) * uMouseStrength;
  world.xy += normalize(away + 1e-5) * push * 0.55;
  world.z += push * 0.35;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  float depth = -mv.z;
  float size = uSize * (0.35 + aRandom.y * aRandom.y * 1.6);
  gl_PointSize = min(size * uPixelRatio / depth, 22.0 * uPixelRatio);

  float twinkle = 0.75 + 0.25 * sin(uTime * (0.6 + aRandom.x * 1.6) + aRandom.y * 30.0);
  // Near side bright, far side dim: gives the formations real volume
  float facing = 0.28 + 0.72 * smoothstep(9.4, 5.0, depth);
  float fade = facing * smoothstep(0.8, 2.8, depth) * (1.0 - smoothstep(10.0, 17.0, depth));
  vAlpha = (uOpacity * twinkle * (0.35 + aRandom.x * 0.65) + push * 0.35 * uOpacity) * fade;
  vColor = mix(uColorA, uColorB, clamp(aRandom.y * 0.85 + push + swirl * 0.35, 0.0, 1.0));
}
`;

export const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = pow(1.0 - d * 2.0, 1.8);
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;
