import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildShapes, sampleText } from "./shapes";
import { vertexShader, fragmentShader } from "./shaders";
import { readScrollStage, atStage } from "./scrollStage";
import { markIntroDone, on, sceneState } from "../../lib/bus";

// Per-stage look: [hero, work, about, contact]
const OPACITY = [1.15, 0.45, 0.6, 0.8];
const OFFSET_X = [0.25, 0, 0.24, 0]; // fraction of viewport width, desktop only
const SPIN_SPEED = [0.07, 0, 0.09, 0.05];
const BURST_DURATION = 2.4;
const DEFAULT_ACCENT = new THREE.Color("#a99bff");

// Intro timeline (seconds): assemble the name, hold, then release into the hero sphere
const ASSEMBLE = 1.2;
const RELEASE_AT = 2.0;
const RELEASE = 1.3;

const ease = (x) => 1 - Math.pow(1 - x, 3);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

function shouldPlayIntro(reduced) {
  // introDone already set means the fallback timer beat the scene load: don't hide content again
  if (reduced || sceneState.introDone || window.scrollY > 80) return false;
  try {
    return !sessionStorage.getItem("intro-seen");
  } catch {
    return true;
  }
}

export default function ParticleField({ reduced }) {
  const points = useRef();
  const { size, viewport, gl, setDpr, invalidate } = useThree();

  const count = useMemo(() => (window.innerWidth < 768 ? 9000 : 22000), []);

  const geometry = useMemo(() => {
    const { sphere, terrain, knot, galaxy, random } = buildShapes(count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sphere, 3));
    g.setAttribute("aTerrain", new THREE.BufferAttribute(terrain, 3));
    g.setAttribute("aKnot", new THREE.BufferAttribute(knot, 3));
    g.setAttribute("aGalaxy", new THREE.BufferAttribute(galaxy, 3));
    g.setAttribute("aText", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(random, 2));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uStage: { value: 0 },
          uSpin: { value: 0 },
          uPixelRatio: { value: 1 },
          uSize: { value: 20 },
          uOpacity: { value: 0 },
          uBurst: { value: 0 },
          uMouse: { value: new THREE.Vector2(99, 99) },
          uMouseStrength: { value: 0 },
          uColorA: { value: new THREE.Color("#e9e9f2") },
          uColorB: { value: DEFAULT_ACCENT.clone() },
          uAssemble: { value: 1 },
          uRelease: { value: 1 },
          uFocus: { value: new THREE.Vector2(99, 99) },
          uFocusStrength: { value: 0 },
          uTextShift: { value: 0 },
          uNoise: { value: 1 },
        },
      }),
    []
  );

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  // ── Intro ─────────────────────────────────────────────────────────────────
  // start < 0: not playing. textReady gates the timeline until fonts are in.
  const intro = useRef({ start: -1, textReady: false, play: shouldPlayIntro(reduced) });

  useEffect(() => {
    let cancelled = false;
    const build = async () => {
      try {
        await document.fonts.load("600 220px Geist");
      } catch {
        // fall back to the system font
      }
      if (cancelled) return;
      const mobile = viewport.width < 6;
      const mobileScale = Math.min(1, viewport.width / 5.4);
      const text = sampleText(
        count,
        mobile ? ["AMIT", "KUMAR"] : ["AMIT KUMAR"],
        (viewport.width * (mobile ? 0.7 : 0.78)) / mobileScale
      );
      geometry.attributes.aText.array.set(text);
      geometry.attributes.aText.needsUpdate = true;
      intro.current.textReady = true;
    };
    build();
    return () => {
      cancelled = true;
    };
    // Built once at mount size; replays reuse it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, count]);

  useEffect(() => {
    if (!intro.current.play) markIntroDone();
    const replay = () => {
      if (reduced) return;
      intro.current.play = true;
      intro.current.start = -1;
      intro.current.replay = true; // the terminal scrolls to top itself; don't skip ahead
    };
    return on("scene:intro", replay);
  }, [reduced]);

  // ── Pointer (mouse only, touch shouldn't fight scrolling) ──────────────────
  const pointer = useRef({ x: 0, y: 0, active: false });
  useEffect(() => {
    const move = (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.current.active = true;
    };
    const leave = () => (pointer.current.active = false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Reduced motion renders on demand, so redraw when anything changes
  useEffect(() => {
    if (!reduced) return;
    const offs = [on("scene:accent", invalidate), on("scene:shape", invalidate)];
    window.addEventListener("scroll", invalidate, { passive: true });
    return () => {
      offs.forEach((off) => off());
      window.removeEventListener("scroll", invalidate);
    };
  }, [reduced, invalidate]);

  const clock = useRef(0);
  const burstStart = useRef(-1);
  useEffect(
    () =>
      on("scene:burst", () => {
        if (!reduced) burstStart.current = clock.current;
      }),
    [reduced]
  );

  const state = useRef({ stage: readScrollStage(), spin: 0, tiltX: 0, tiltY: 0, mouse: 0, fade: 0, focus: 0 });
  const targetColor = useRef(new THREE.Color());
  const perf = useRef({ frames: 0, elapsed: 0, step: 0 });
  const stats = useRef({ frames: 0, elapsed: 0 });

  useEffect(() => {
    const ctx = gl.getContext();
    const ext = ctx.getExtension("WEBGL_debug_renderer_info");
    sceneState.stats.renderer = String(ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ctx.getParameter(ctx.RENDERER));
    sceneState.stats.particles = count;
  }, [gl, count]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const s = state.current;
    const u = material.uniforms;
    const desktop = size.width >= 1024;
    clock.current += reduced ? 0 : dt;

    // Stage: terminal override wins until the visitor scrolls away
    if (sceneState.shape !== null && Math.abs(window.scrollY - sceneState.shapeScrollY) > 120) {
      sceneState.shape = null;
    }
    const target = sceneState.shape ?? readScrollStage();
    if (reduced) {
      s.stage = target;
      s.fade = 1;
    } else {
      s.stage += (target - s.stage) * (1 - Math.exp(-dt * 3.2));
      s.fade = Math.min(1, s.fade + dt * 0.8);
      s.spin += dt * atStage(SPIN_SPEED, s.stage) * sceneState.tweak.speed;
    }

    // Intro timeline
    const it = intro.current;
    let assemble = 1;
    let release = 1;
    if (it.play && it.textReady) {
      if (it.start < 0) it.start = clock.current;
      let t = clock.current - it.start;
      if (!it.replay && window.scrollY > 80 && t < RELEASE_AT) {
        it.start -= RELEASE_AT - t; // visitor is scrolling: skip ahead to the release
        t = RELEASE_AT;
      }
      assemble = clamp01(t / ASSEMBLE);
      release = clamp01((t - RELEASE_AT) / RELEASE);
      if (release >= 0.55) {
        markIntroDone();
        try {
          sessionStorage.setItem("intro-seen", "1");
        } catch {
          // private mode
        }
      }
      if (release >= 1) it.play = it.replay = false;
    } else if (it.play) {
      assemble = 0;
      release = 0;
    }

    // Pointer tilt + repulsion
    const p = pointer.current;
    const k = 1 - Math.exp(-dt * 2.5);
    s.tiltX += ((p.active ? -p.y * 0.12 : 0) - s.tiltX) * k;
    s.tiltY += ((p.active ? p.x * 0.18 : 0) - s.tiltY) * k;
    s.mouse += ((p.active && !reduced ? 1 : 0) - s.mouse) * k;

    // Hovered project: gather around it and take on its colour
    const focusEl = sceneState.focusEl;
    if (focusEl) {
      const r = focusEl.getBoundingClientRect();
      const fx = ((r.left + r.width / 2) / size.width) * 2 - 1;
      const fy = -(((r.top + r.height / 2) / size.height) * 2 - 1);
      u.uFocus.value.set((fx * viewport.width) / 2, (fy * viewport.height) / 2);
    }
    s.focus += ((focusEl && !reduced ? 1 : 0) - s.focus) * (1 - Math.exp(-dt * 3));
    targetColor.current.set(sceneState.accent ?? sceneState.tweak.accent ?? DEFAULT_ACCENT);
    if (reduced) u.uColorB.value.copy(targetColor.current);
    else u.uColorB.value.lerp(targetColor.current, 1 - Math.exp(-dt * 4));

    const mobileScale = Math.min(1, viewport.width / 5.4);
    const offsetX = desktop ? atStage(OFFSET_X, s.stage) * viewport.width : 0;
    const group = points.current;
    group.position.x = offsetX;
    group.scale.setScalar(mobileScale);
    group.rotation.set(s.tiltX, s.tiltY, 0);

    let burst = 0;
    if (burstStart.current >= 0) {
      const phase = (clock.current - burstStart.current) / BURST_DURATION;
      if (phase >= 1) burstStart.current = -1;
      else burst = Math.sin(phase * Math.PI) * (1 - phase * 0.4);
    }

    const stageOpacity = atStage(OPACITY, s.stage) * (desktop ? 1 : 0.7);
    // Full strength while the name is on screen, so it reads on mobile too
    const introOpacity = 1.45 * (1 - release) + stageOpacity * release;

    u.uTime.value = clock.current;
    u.uStage.value = s.stage;
    u.uSpin.value = s.spin;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uOpacity.value = (introOpacity + s.focus * 0.3) * ease(s.fade);
    u.uBurst.value = burst;
    u.uMouse.value.set((p.x * viewport.width) / 2, (p.y * viewport.height) / 2);
    u.uMouseStrength.value = s.mouse;
    u.uAssemble.value = assemble;
    u.uRelease.value = release;
    u.uFocusStrength.value = s.focus;
    u.uTextShift.value = -offsetX / mobileScale;
    u.uSize.value = 20 * sceneState.tweak.size;
    u.uNoise.value = sceneState.tweak.noise;

    // Live stats for the "under the hood" panel
    const st = stats.current;
    st.frames++;
    st.elapsed += rawDelta;
    if (st.elapsed >= 0.5) {
      sceneState.stats.fps = Math.round(st.frames / st.elapsed);
      sceneState.stats.dpr = gl.getPixelRatio();
      sceneState.stats.particles = geometry.drawRange.count === Infinity ? count : geometry.drawRange.count;
      st.frames = 0;
      st.elapsed = 0;
    }

    // Adaptive quality: drop resolution, then particle count, on slow GPUs
    if (!reduced && perf.current.step < 2) {
      const pf = perf.current;
      pf.frames++;
      pf.elapsed += rawDelta;
      if (pf.frames === 90) {
        if (pf.elapsed / pf.frames > 1 / 45) {
          if (pf.step === 0) setDpr(1);
          else geometry.setDrawRange(0, Math.floor(count * 0.5));
          pf.step++;
        } else {
          pf.step = 2;
        }
        pf.frames = 0;
        pf.elapsed = 0;
      }
    }
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
