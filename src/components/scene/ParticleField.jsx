import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildShapes } from "./shapes";
import { vertexShader, fragmentShader } from "./shaders";
import { readScrollStage, atStage } from "./scrollStage";

// Per-stage look: [hero, work, about, contact]
const OPACITY = [1.15, 0.45, 0.6, 0.8];
const OFFSET_X = [0.25, 0, 0.24, 0]; // fraction of viewport width, desktop only
const SPIN_SPEED = [0.07, 0, 0.09, 0.05];
const BURST_DURATION = 2.4;

export default function ParticleField({ reduced, burstSignal }) {
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
          uColorB: { value: new THREE.Color("#a99bff") },
        },
      }),
    []
  );

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  // Mouse only (touch shouldn't fight scrolling)
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

  // Reduced motion renders on demand, so redraw when the page moves
  useEffect(() => {
    if (!reduced) return;
    window.addEventListener("scroll", invalidate, { passive: true });
    return () => window.removeEventListener("scroll", invalidate);
  }, [reduced, invalidate]);

  const burstStart = useRef(-1);
  const clockRef = useRef(0);
  useEffect(() => {
    if (burstSignal && !reduced) burstStart.current = clockRef.current;
  }, [burstSignal, reduced]);

  const state = useRef({ stage: readScrollStage(), spin: 0, tiltX: 0, tiltY: 0, mouse: 0, intro: 0 });
  const perf = useRef({ frames: 0, elapsed: 0, step: 0 });

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const s = state.current;
    const u = material.uniforms;
    const desktop = size.width >= 1024;

    const target = readScrollStage();
    if (reduced) {
      s.stage = target;
      s.intro = 1;
    } else {
      clockRef.current += dt;
      s.stage += (target - s.stage) * (1 - Math.exp(-dt * 3.2));
      s.intro = Math.min(1, s.intro + dt * 0.5);
      s.spin += dt * atStage(SPIN_SPEED, s.stage);
    }

    const p = pointer.current;
    const k = 1 - Math.exp(-dt * 2.5);
    s.tiltX += ((p.active ? -p.y * 0.12 : 0) - s.tiltX) * k;
    s.tiltY += ((p.active ? p.x * 0.18 : 0) - s.tiltY) * k;
    s.mouse += ((p.active && !reduced ? 1 : 0) - s.mouse) * k;

    const intro = 1 - Math.pow(1 - s.intro, 3);
    const mobileScale = Math.min(1, viewport.width / 5.4);
    const group = points.current;
    group.position.x = desktop ? atStage(OFFSET_X, s.stage) * viewport.width : 0;
    group.scale.setScalar(mobileScale * (0.85 + intro * 0.15));
    group.rotation.set(s.tiltX, s.tiltY, 0);

    let burst = 0;
    if (burstStart.current >= 0) {
      const phase = (clockRef.current - burstStart.current) / BURST_DURATION;
      if (phase >= 1) burstStart.current = -1;
      else burst = Math.sin(phase * Math.PI) * (1 - phase * 0.4);
    }

    u.uTime.value = clockRef.current;
    u.uStage.value = s.stage;
    u.uSpin.value = s.spin;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uOpacity.value = atStage(OPACITY, s.stage) * intro * (desktop ? 1 : 0.7);
    u.uBurst.value = burst;
    u.uMouse.value.set((p.x * viewport.width) / 2, (p.y * viewport.height) / 2);
    u.uMouseStrength.value = s.mouse;

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
