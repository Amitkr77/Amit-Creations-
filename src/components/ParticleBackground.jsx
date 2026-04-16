  import { useEffect, useRef } from 'react';

  // ─── Constants ────────────────────────────────────────────────────────────────
  const CONNECTION_DIST    = 130;
  const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
  const CELL_SIZE          = CONNECTION_DIST; // spatial grid cell = connection radius
  const FRICTION           = 0.993;
  const MOUSE_FORCE        = 0.0006;
  const BURST_COUNT        = 60;
  const BURST_SPEED        = 5;
  const PARTICLE_DENSITY   = 1 / 8000; // 1 particle per 8 000 px² of screen area
  const MAX_PARTICLES      = 220;
  const MIN_PARTICLES      = 60;

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  /** Target persistent particle count based on current viewport area */
  function targetCount(w, h) {
    return Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, Math.round(w * h * PARTICLE_DENSITY)));
  }

  function makePersistent(w, h) {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      hue: Math.floor(200 + Math.random() * 80),
      life: 1,
      isBurst: false,
      decay: 0,
    };
  }

  function makeBurst(bx, by) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * BURST_SPEED + 1;
    return {
      x: bx,
      y: by,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 2,
      size: Math.random() * 2.5 + 0.8,
      hue: Math.floor(200 + Math.random() * 120),
      life: 1,
      isBurst: true,
      decay: 0.012 + Math.random() * 0.01,
    };
  }

  /**
   * Rescale persistent particle positions proportionally when the viewport changes.
   * Adds or removes particles to match the new target density.
   */
  function adaptParticles(particles, oldW, oldH, newW, newH) {
    const scaleX = newW / oldW;
    const scaleY = newH / oldH;

    // Rescale positions — keeps the visual distribution intact
    const adapted = particles.map((p) => {
      if (p.isBurst) return p; // burst particles die naturally; don't reposition
      return { ...p, x: p.x * scaleX, y: p.y * scaleY };
    });

    const persistent = adapted.filter((p) => !p.isBurst);
    const burst      = adapted.filter((p) => p.isBurst);
    const target     = targetCount(newW, newH);

    if (persistent.length < target) {
      // Seed new particles in the newly revealed area (or anywhere if shrink → grow)
      const needed = target - persistent.length;
      for (let i = 0; i < needed; i++) persistent.push(makePersistent(newW, newH));
    } else if (persistent.length > target) {
      persistent.splice(target); // drop the excess from the tail
    }

    return [...persistent, ...burst];
  }

  /**
   * Lightweight spatial grid for O(n) neighbour queries.
   * Rebuilt each frame — cheap at <220 particles.
   */
  function buildGrid(particles, cellSize) {
    const grid = new Map();
    const key   = (cx, cy) => (cx << 16) ^ cy; // bitpack — safe for grids < 32 768 cells wide

    for (const p of particles) {
      const cx = Math.floor(p.x / cellSize);
      const cy = Math.floor(p.y / cellSize);
      const k  = key(cx, cy);
      if (!grid.has(k)) grid.set(k, []);
      grid.get(k).push(p);
    }

    return { grid, key };
  }

  // ─── Component ────────────────────────────────────────────────────────────────

  export default function ParticleBackground({ enabled = true, burstSignal = 0 }) {
    const canvasRef    = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef     = useRef({ x: 0.5, y: 0.5 });
    const sizeRef      = useRef({ w: 0, h: 0 }); // single source of truth for current dimensions
    const rafRef       = useRef(0);
    const timeRef      = useRef(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      // ── Initial sizing ────────────────────────────────────────────────────────
      let DPR = Math.min(window.devicePixelRatio || 1, 2);

      const applySize = (w, h) => {
        DPR = Math.min(window.devicePixelRatio || 1, 2); // re-read on every resize
        canvas.width        = Math.round(w * DPR);
        canvas.height       = Math.round(h * DPR);
        canvas.style.width  = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      };

      const initW = window.innerWidth;
      const initH = window.innerHeight;
      sizeRef.current = { w: initW, h: initH };
      applySize(initW, initH);

      particlesRef.current = Array.from(
        { length: targetCount(initW, initH) },
        () => makePersistent(initW, initH)
      );

      // ── Resize — use ResizeObserver for canvas, window resize for DPR changes ─
      const handleResize = (newW, newH) => {
        const { w: oldW, h: oldH } = sizeRef.current;
        if (newW === oldW && newH === oldH) return; // no-op on spurious events

        applySize(newW, newH);
        particlesRef.current = adaptParticles(particlesRef.current, oldW, oldH, newW, newH);
        sizeRef.current = { w: newW, h: newH };
      };

      // ResizeObserver fires on *any* layout change (address bar, keyboard, etc.)
      const ro = new ResizeObserver(() => {
        handleResize(window.innerWidth, window.innerHeight);
      });
      ro.observe(document.documentElement);

      // Also listen for window resize to catch DPR changes (monitor switching)
      const onWindowResize = () => handleResize(window.innerWidth, window.innerHeight);
      window.addEventListener('resize', onWindowResize);

      // ── Mouse ─────────────────────────────────────────────────────────────────
      const onMove = (e) => {
        const { w, h } = sizeRef.current;
        mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
      };
      const onLeave = () => { mouseRef.current = { x: 0.5, y: 0.5 }; };

      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseleave', onLeave);

      // ── Animation loop ────────────────────────────────────────────────────────
      const tick = (timestamp) => {
        // Delta time — normalised to 60 fps, capped to avoid spiral of death
        const raw = timestamp - timeRef.current;
        const dt  = raw > 0 ? Math.min(raw / 16.67, 3) : 1;
        timeRef.current = timestamp;

        const { w: W, h: H } = sizeRef.current;
        const { x: mx, y: my } = mouseRef.current;

        // Clear with full canvas buffer size
        ctx.clearRect(0, 0, W, H);

        // Background gradient — follows mouse
        const grd = ctx.createRadialGradient(
          W * mx, H * my, 0,
          W * mx, H * my, Math.max(W, H) * 0.75
        );
        grd.addColorStop(0,   'rgba(124, 58, 237, 0.055)');
        grd.addColorStop(0.5, 'rgba(99,  102, 241, 0.02)');
        grd.addColorStop(1,   'rgba(236, 72,  153, 0.015)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // ── Update particles ────────────────────────────────────────────────────
        const friction = Math.pow(FRICTION, dt);
        particlesRef.current = particlesRef.current.filter((p) => {
          if (p.isBurst) {
            p.life -= p.decay * dt;
            if (p.life <= 0) return false;
            p.vy -= 0.015 * dt; // upward drift
          }

          const force = p.isBurst ? MOUSE_FORCE * 0.3 : MOUSE_FORCE;
          p.vx += (mx - p.x / W) * force * dt;
          p.vy += (my - p.y / H) * force * dt;
          p.vx *= friction;
          p.vy *= friction;
          p.x  += p.vx * dt;
          p.y  += p.vy * dt;

          // Wrap persistent particles; let burst particles fly offscreen and die
          if (!p.isBurst) {
            if (p.x < -20) p.x = W + 20;
            if (p.x > W + 20) p.x = -20;
            if (p.y < -20) p.y = H + 20;
            if (p.y > H + 20) p.y = -20;
          }

          return true;
        });

        const live = particlesRef.current;

        // ── Draw connections via spatial grid ───────────────────────────────────
        const { grid, key } = buildGrid(live, CELL_SIZE);

        // For each particle, only check its own cell + the 4 right/bottom neighbours
        // (left/top pairs are handled when those cells process their own particles)
        const neighbours = [[0,0],[1,0],[0,1],[1,1],[-1,1]];

        for (const p of live) {
          const cx = Math.floor(p.x / CELL_SIZE);
          const cy = Math.floor(p.y / CELL_SIZE);

          for (const [dx, dy] of neighbours) {
            const cell = grid.get(key(cx + dx, cy + dy));
            if (!cell) continue;

            for (const q of cell) {
              if (q === p) continue;
              // When dx===0 && dy===0 we're in the same cell — skip already-processed pairs
              if (dx === 0 && dy === 0 && q <= p) continue;

              const ddx = p.x - q.x;
              const ddy = p.y - q.y;
              const d2  = ddx * ddx + ddy * ddy;
              if (d2 >= CONNECTION_DIST_SQ) continue;

              const t     = 1 - d2 / CONNECTION_DIST_SQ;
              const alpha = t * t * 0.2 * Math.min(p.life, q.life);

              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 70%, 70%, ${alpha})`;
              ctx.lineWidth   = t * 1.2;
              ctx.stroke();
            }
          }
        }

        // ── Draw particles ──────────────────────────────────────────────────────
        for (const p of live) {
          const alpha = 0.75 * p.life;

          // Outer glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${alpha * 0.12})`;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${alpha})`;
          ctx.fill();
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafRef.current);
        ro.disconnect();
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseleave', onLeave);
      };
    }, []);

    // ── Burst effect ─────────────────────────────────────────────────────────────
    useEffect(() => {
      if (!burstSignal) return;
      const { w: W, h: H }  = sizeRef.current;
      const bx              = W * mouseRef.current.x;
      const by              = H * mouseRef.current.y;
      const burst           = Array.from({ length: BURST_COUNT }, () => makeBurst(bx, by));
      const persistent      = particlesRef.current.filter((p) => !p.isBurst);
      particlesRef.current  = [...persistent, ...burst].slice(0, MAX_PARTICLES);
    }, [burstSignal]);

    return (
      <canvas
        ref={canvasRef}
        style={{
          position:   'fixed',
          inset:      0,
          pointerEvents: 'none',
          opacity:    enabled ? 1 : 0,
          transition: 'opacity 600ms ease',
          zIndex:     0,
        }}
      />
    );
  }