import { useEffect, useState } from 'react';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export default function KeyboardEasterEggs({ onToggleParticles, onKonami, onHelp }) {
  const [keys, setKeys] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      // Track Konami code
      setKeys((prev) => {
        const next = [...prev, key].slice(-KONAMI.length);
        if (KONAMI.every((k, i) => next[i] === k)) {
          showToast('Konami unlocked! [sparkles]');
          onKonami?.();
        }
        return next;
      });

      // Toggle particles with 'p'
      if (key.toLowerCase() === 'p') {
        onToggleParticles?.();
        showToast('Particles toggled');
      }

      // Show help with '?'
      if (key === '?') {
        onHelp?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleParticles, onKonami, onHelp]);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => setToast(''), 1800);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      {toast && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-full bg-slate-900/90 px-4 py-2 text-sm text-white shadow-lg backdrop-blur">
          {toast}
        </div>
      )}
    </div>
  );
}