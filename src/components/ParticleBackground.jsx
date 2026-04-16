import { useEffect, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CONNECTION_DIST    = 140;
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
const CELL_SIZE          = CONNECTION_DIST;
const FRICTION           = 0.992;
const MOUSE_ATTRACT      = 0.0004;
const REPEL_RADIUS       = 110;
const REPEL_FORCE        = 1.1;
const BURST_COUNT        = 70;
const BURST_SPEED        = 6;
const PARTICLE_DENSITY   = 1 / 6500;
const MAX_PARTICLES      = 250;
const MIN_PARTICLES      = 70;
const DRIFT              = 0.02;
const DUST_COUNT         = 45;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function targetCount(w, h) {
  return Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, Math.round(w * h * PARTICLE_DENSITY)));
}

function makePersistent(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    baseSize: Math.random() * 1.8 + 0.6,
    hue: 220 + Math.random() * 60,
    sat: 75 + Math.random() * 20,
    life: 1,
    isBurst: false,
    decay: 0,
    phase: Math.random() * Math.PI * 2,
    breathSpeed: 0.25 + Math.random() * 0.45,
  };
}

function makeBurst(bx, by) {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * BURST_SPEED + 1.5;
  return {
    x: bx,
    y: by,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - Math.random() * 2,
    baseSize: Math.random() * 2.5 + 0.8,
    hue: 200 + Math.random() * 140,
    sat: 85 + Math.random() * 15,
    life: 1,
    isBurst: true,
    decay: 0.01 + Math.random() * 0.012,
    phase: Math.random() * Math.PI * 2,
    breathSpeed: 0,
  };
}

function makeDust(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    size: Math.random() * 0.8 + 0.2,
    alpha: Math.random() * 0.18 + 0.04,
    phase: Math.random() * Math.PI * 2,
  };
}

function adaptAll(particles, dust, oldW, oldH, newW, newH) {
  const sx = newW / oldW;
  const sy = newH / oldH;

  const adapted = particles.map((p) =>
    p.isBurst ? p : { ...p, x: p.x * sx, y: p.y * sy }
  );

  const persistent = adapted.filter((p) => !p.isBurst);
  const burst      = adapted.filter((p) => p.isBurst);
  const target     = targetCount(newW, newH);

  if (persistent.length < target) {
    for (let i = 0; i < target - persistent.length; i++) persistent.push(makePersistent(newW, newH));
  } else if (persistent.length > target) {
    persistent.splice(target);
  }

  return {
    particles: [...persistent, ...burst],
    dust: dust.map((d) => ({ ...d, x: d.x * sx, y: d.y * sy })),
  };
}

function buildGrid(particles, cellSize) {
  const grid = new Map();
  const key  = (cx, cy) => (cx << 16) ^ cy;
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
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const dustRef = useRef([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef(0);
  const timeRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let DPR = Math.min(window.devicePixelRatio || 1, 2);

    const applySize = (w, h) => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const initW = window.innerWidth;
    const initH = window.innerHeight;
    sizeRef.current = { w: initW, h: initH };
    applySize(initW, initH);
    particlesRef.current = Array.from({ length: targetCount(initW, initH) }, () => makePersistent(initW, initH));
    dustRef.current = Array.from({ length: DUST_COUNT }, () => makeDust(initW, initH));

    // ── Resize ────────────────────────────────────────────────────────────────
    const handleResize = (nw, nh) => {
      const { w: ow, h: oh } = sizeRef.current;
      if (nw === ow && nh === oh) return;
      applySize(nw, nh);
      const r = adaptAll(particlesRef.current, dustRef.current, ow, oh, nw, nh);
      particlesRef.current = r.particles;
      dustRef.current = r.dust;
      sizeRef.current = { w: nw, h: nh };
    };

    const ro = new ResizeObserver(() => handleResize(window.innerWidth, window.innerHeight));
    ro.observe(document.documentElement);
    const onWinResize = () => handleResize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', onWinResize);

    // ── Mouse / Touch ─────────────────────────────────────────────────────────
    const onMove = (e) => {
      const { w, h } = sizeRef.current;
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h, active: true };
    };
    const onLeave = () => { mouseRef.current.active = false; };
    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      const { w, h } = sizeRef.current;
      mouseRef.current = { x: t.clientX / w, y: t.clientY / h, active: true };
    };
    const onTouchEnd = () => { mouseRef.current.active = false; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ── Loop ──────────────────────────────────────────────────────────────────
    const tick = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;

      const raw = timestamp - timeRef.current;
      const dt = raw > 0 ? Math.min(raw / 16.67, 3) : 1;
      timeRef.current = timestamp;

      // Fade-in over 1.5 s
      const fadeIn = Math.min(1, (timestamp - startRef.current) / 1500);
      const { w: W, h: H } = sizeRef.current;
      const { x: mx, y: my, active } = mouseRef.current;
      const mxPx = mx * W;
      const myPx = my * H;
      const sec = timestamp * 0.001;

      ctx.clearRect(0, 0, W, H);

      // ── Vignette ────────────────────────────────────────────────────────────
      const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, Math.max(W, H) * 0.8);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, `rgba(0,0,0,${0.04 * fadeIn})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // ── Cursor glow ─────────────────────────────────────────────────────────
      if (active) {
        const cg = ctx.createRadialGradient(mxPx, myPx, 0, mxPx, myPx, 220);
        cg.addColorStop(0, `rgba(139,92,246,${0.08 * fadeIn})`);
        cg.addColorStop(0.35, `rgba(99,102,241,${0.035 * fadeIn})`);
        cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Dust ────────────────────────────────────────────────────────────────
      for (const d of dustRef.current) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vx += (Math.random() - 0.5) * 0.004 * dt;
        d.vy += (Math.random() - 0.5) * 0.004 * dt;
        if (d.x < -10) d.x = W + 10;
        if (d.x > W + 10) d.x = -10;
        if (d.y < -10) d.y = H + 10;
        if (d.y > H + 10) d.y = -10;

        const twinkle = 0.4 + 0.6 * Math.sin(sec * 1.2 + d.phase);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(175,185,215,${d.alpha * twinkle * fadeIn})`;
        ctx.fill();
      }

      // ── Update particles ────────────────────────────────────────────────────
      const friction = Math.pow(FRICTION, dt);

      particlesRef.current = particlesRef.current.filter((p) => {
        if (p.isBurst) {
          p.life -= p.decay * dt;
          if (p.life <= 0) return false;
          p.vy -= 0.02 * dt;
        }

        if (active) {
          const dx = p.x - mxPx;
          const dy = p.y - myPx;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPEL_RADIUS && dist > 1) {
            // Repel — push away
            const str = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
            p.vx += (dx / dist) * str * dt;
            p.vy += (dy / dist) * str * dt;
          } else {
            // Attract — gentle pull
            const f = p.isBurst ? MOUSE_ATTRACT * 0.25 : MOUSE_ATTRACT;
            p.vx += (mx - p.x / W) * f * dt;
            p.vy += (my - p.y / H) * f * dt;
          }
        }

        if (!p.isBurst) {
          p.vx += (Math.random() - 0.5) * DRIFT * dt;
          p.vy += (Math.random() - 0.5) * DRIFT * dt;
        }

        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (!p.isBurst) {
          if (p.x < -20) p.x = W + 20;
          if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20;
          if (p.y > H + 20) p.y = -20;
        }
        return true;
      });

      const live = particlesRef.current;

      // ── Connections ─────────────────────────────────────────────────────────
      const { grid, key } = buildGrid(live, CELL_SIZE);
      const neighbours = [[0, 0], [1, 0], [0, 1], [1, 1], [-1, 1]];
      ctx.lineCap = 'round';

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
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 >= CONNECTION_DIST_SQ) continue;

            const t = 1 - d2 / CONNECTION_DIST_SQ;

            // Mouse proximity boost
            let mb = 0;
            if (active) {
              const md = Math.hypot((p.x + q.x) * 0.5 - mxPx, (p.y + q.y) * 0.5 - myPx);
              mb = Math.max(0, 1 - md / 260) * 0.45;
            }

            const alpha = (t * t * 0.17 + mb * t) * Math.min(p.life, q.life) * fadeIn;
            const hue = (p.hue + q.hue) / 2 + mb * 35;
            const lit = 66 + mb * 14;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${hue},72%,${lit}%,${alpha})`;
            ctx.lineWidth = t * 1.1 + mb * 0.6;
            ctx.stroke();
          }
        }
      }

      // ── Particles — additive glow ───────────────────────────────────────────
      ctx.globalCompositeOperation = 'lighter';

      for (const p of live) {
        const breath = p.breathSpeed > 0 ? 1 + Math.sin(sec * p.breathSpeed + p.phase) * 0.2 : 1;
        const size = p.baseSize * breath * (0.85 + p.life * 0.15);
        const a = 0.7 * p.life * fadeIn;

        // Mouse proximity
        let mb = 0;
        if (active) {
          const md = Math.hypot(p.x - mxPx, p.y - myPx);
          mb = Math.max(0, 1 - md / 300) * 0.55;
        }
        const hueShift = mb * 45;

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + hueShift},${p.sat}%,60%,${a * 0.045 + mb * 0.03})`;
        ctx.fill();

        // Mid glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 1.9, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + hueShift * 0.7},${p.sat}%,68%,${a * 0.14 + mb * 0.07})`;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + hueShift * 0.5},${p.sat - 8}%,84%,${a * 0.9 + mb * 0.1})`;
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('resize', onWinResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // ── Burst ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!burstSignal) return;
    const { w: W, h: H } = sizeRef.current;
    const bx = W * mouseRef.current.x;
    const by = H * mouseRef.current.y;
    const burst = Array.from({ length: BURST_COUNT }, () => makeBurst(bx, by));
    const persistent = particlesRef.current.filter((p) => !p.isBurst);
    particlesRef.current = [...persistent, ...burst].slice(0, MAX_PARTICLES);
  }, [burstSignal]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        opacity: enabled ? 1 : 0,
        transition: 'opacity 600ms ease',
        zIndex: 0,
      }}
    />
  );
}