import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleField from "./ParticleField";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Scene({ active = true }) {
  const [reduced] = useState(prefersReducedMotion);
  const [ready, setReady] = useState(false);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000 ease-out"
      style={{ opacity: active && ready ? 1 : 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={!active ? "never" : reduced ? "demand" : "always"}
        onCreated={() => setReady(true)}
      >
        <ParticleField reduced={reduced} />
      </Canvas>
    </div>
  );
}
