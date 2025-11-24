import { useEffect, useRef } from 'react';

export default function ParticleBackground({ enabled = true, burstSignal = 0 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // Resize handler
    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    // Create initial particles
    const createParticles = (count = 150) => {
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2 + 0.6,
          hue: Math.floor(200 + Math.random() * 80),
          life: 1,
        });
      }
      particlesRef.current = arr;
    };
    createParticles();

    // Mouse move handler
    const onMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    // window.addEventListener('mousemove', onMove);
    // window.addEventListener('resize', resize);

    // Animation loop
    const tick = () => {
      const particles = particlesRef.current;
      const { innerWidth: w, innerHeight: h } = window;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Soft radial gradient background
      const grd = ctx.createRadialGradient(
        w * mouseRef.current.x,
        h * mouseRef.current.y,
        20,
        w / 2,
        h / 2,
        Math.max(w, h)
      );
      grd.addColorStop(0, 'rgba(124, 58, 237, 0.06)'); // violet-600
      grd.addColorStop(1, 'rgba(236, 72, 153, 0.02)'); // fuchsia-500
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p) => {
        // Parallax attraction to mouse
        p.vx += (mouseRef.current.x - p.x / w) * 0.0008;
        p.vy += (mouseRef.current.y - p.y / h) * 0.0008;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${0.7 * p.life})`;
        ctx.fill();
      });

      // Connect nearby particles
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)'; // slate-400/15
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < i + 12 && j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;

          if (d2 < 120 * 120) {
            ctx.globalAlpha = 1 - d2 / (120 * 120);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      // window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Burst effect on signal
  useEffect(() => {
    if (!burstSignal) return;

    const particles = particlesRef.current;
    const { innerWidth: w, innerHeight: h } = window;

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: w / 2,
        y: h / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - Math.random() * 2,
        size: Math.random() * 2 + 1,
        hue: Math.floor(200 + Math.random() * 120),
        life: 1,
      });
    }
  }, [burstSignal]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
        enabled ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}