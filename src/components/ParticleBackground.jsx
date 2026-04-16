import { useEffect, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CONNECTION_DIST    = 130;
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
const CELL_SIZE          = CONNECTION_DIST;
const FRICTION           = 0.993;
const MOUSE_FORCE        = 0.0006;
const BURST_COUNT        = 60;
const BURST_SPEED        = 5;
const PARTICLE_DENSITY   = 1 / 8000;
const MAX_PARTICLES      = 220;
const MIN_PARTICLES      = 60;
const DRIFT              = 0.015; // tiny Brownian motion to keep particles alive

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function adaptParticles(particles, oldW, oldH, newW, newH) {
  const scaleX = newW / oldW;
  const scaleY = newH / oldH;

  const adapted = particles.map((p) => {
    if (p.isBurst) return p;
    return { ...p, x: p.x * scaleX, y: p.y * scaleY };
  });

  const persistent = adapted.filter((p) => !p.isBurst);
  const burst      = adapted.filter((p) => p.isBurst);
  const target     = targetCount(newW, newH);

  if (persistent.length < target) {
    const needed = target - persistent.length;
    for (let i = 0; i < needed; i++) persistent.push(makePersistent(newW, newH));
  } else if (persistent.length > target) {
    persistent.splice(target);
  }

  return [...persistent, ...burst];
}

function buildGrid(particles, cellSize) {
  const grid = new Map();
  const key   = (cx, cy) => (cx << 16) ^ cy;

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
  // ✅ FIX: added `active` flag — force is ONLY applied when mouse is on-screen
  const mouseRef     = useRef({ x: 0.5, y: 0.5, active: false });
  const sizeRef      = useRef({ w: 0, h: 0 });
  const rafRef       = useRef(0);
  const timeRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let DPR = Math.min(window.devicePixelRatio || 1, 2);

    const applySize = (w, h) => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
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

    // ── Resize ────────────────────────────────────────────────────────────────
    const handleResize = (newW, newH) => {
      const { w: oldW, h: oldH } = sizeRef.current;
      if (newW === oldW && newH === oldH) return;

      applySize(newW, newH);
      particlesRef.current = adaptParticles(particlesRef.current, oldW, oldH, newW, newH);
      sizeRef.current = { w: newW, h: newH };
    };

    const ro = new ResizeObserver(() => {
      handleResize(window.innerWidth, window.innerHeight);
    });
    ro.observe(document.documentElement);

    const onWindowResize = () => handleResize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', onWindowResize);

    // ── Mouse ─────────────────────────────────────────────────────────────────
    // ✅ FIX: set active=true on move, active=false on leave
    const onMove = (e) => {
      const { w, h } = sizeRef.current;
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h, active: true };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    // ✅ FIX: touch support for mobile
    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const { w, h } = sizeRef.current;
      mouseRef.current = { x: touch.clientX / w, y: touch.clientY / h, active: true };
    };
    const onTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ── Animation loop ────────────────────────────────────────────────────────
    const tick = (timestamp) => {
      const raw = timestamp - timeRef.current;
      const dt  = raw > 0 ? Math.min(raw / 16.67, 3) : 1;
      timeRef.current = timestamp;

      const { w: W, h: H } = sizeRef.current;
      const { x: mx, y: my, active } = mouseRef.current;

      ctx.clearRect(0, 0, W, H);

      // ✅ FIX: background gradient only follows mouse when active
      if (active) {
        const grd = ctx.createRadialGradient(
          W * mx, H * my, 0,
          W * mx, H * my, Math.max(W, H) * 0.75
        );
        grd.addColorStop(0,   'rgba(124, 58, 237, 0.055)');
        grd.addColorStop(0.5, 'rgba(99,  102, 241, 0.02)');
        grd.addColorStop(1,   'rgba(236, 72,  153, 0.015)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Update particles ────────────────────────────────────────────────────
      const friction = Math.pow(FRICTION, dt);

      particlesRef.current = particlesRef.current.filter((p) => {
        if (p.isBurst) {
          p.life -= p.decay * dt;
          if (p.life <= 0) return false;
          p.vy -= 0.015 * dt;
        }

        // ✅ FIX: mouse force ONLY when mouse is actually on the viewport
        if (active) {
          const force = p.isBurst ? MOUSE_FORCE * 0.3 : MOUSE_FORCE;
          p.vx += (mx - p.x / W) * force * dt;
          p.vy += (my - p.y / H) * force * dt;
        }

        // ✅ FIX: tiny random drift keeps particles wandering naturally
        // prevents any convergence / clumping when mouse is inactive
        if (!p.isBurst) {
          p.vx += (Math.random() - 0.5) * DRIFT * dt;
          p.vy += (Math.random() - 0.5) * DRIFT * dt;
        }

        p.vx *= friction;
        p.vy *= friction;
        p.x  += p.vx * dt;
        p.y  += p.vy * dt;

        if (!p.isBurst) {
          if (p.x < -20) p.x = W + 20;
          if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20;
          if (p.y > H + 20) p.y = -20;
        }

        return true;
      });

      const live = particlesRef.current;

      // ── Draw connections ────────────────────────────────────────────────────
      const { grid, key } = buildGrid(live, CELL_SIZE);
      const neighbours = [[0,0],[1,0],[0,1],[1,1],[-1,1]];

      for (const p of live) {
        const cx = Math.floor(p.x / CELL_SIZE);
        const cy = Math.floor(p.y / CELL_SIZE);

        for (const [dx, dy] of neighbours) {
          const cell = grid.get(key(cx + dx, cy + dy));
          if (!cell) continue;

          for (const q of cell) {
            if (q === p) continue;
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

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${alpha * 0.12})`;
        ctx.fill();

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
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
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
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        opacity:       enabled ? 1 : 0,
        transition:    'opacity 600ms ease',
        zIndex:        0,
      }}
    />
  );
}