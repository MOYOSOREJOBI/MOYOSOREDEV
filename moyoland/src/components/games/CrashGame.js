'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function CrashGame() {
  const canvasRef = useRef(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [running, setRunning] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint] = useState(() => 1 + Math.random() * 9);
  const [score, setScore] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  const draw = useCallback((mult) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    /* Grid */
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = h - (h / 5) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    /* Curve */
    const progress = Math.min((mult - 1) / 9, 1);
    ctx.beginPath();
    ctx.moveTo(0, h);
    const steps = 100;
    for (let i = 0; i <= steps * progress; i++) {
      const t = i / steps;
      const x = t * w;
      const y = h - Math.pow(t, 1.5) * h * 0.85;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = crashed ? '#ff003c' : '#00f3ff';
    ctx.lineWidth = 3;
    ctx.stroke();

    /* Multiplier text */
    ctx.fillStyle = crashed ? '#ff003c' : '#00f3ff';
    ctx.font = `bold 48px var(--font-display), sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${mult.toFixed(2)}x`, w / 2, h / 2);

    if (crashed) {
      ctx.fillStyle = '#ff003c';
      ctx.font = `bold 18px var(--font-mono), monospace`;
      ctx.fillText('CRASHED', w / 2, h / 2 + 36);
    }
    if (cashedOut) {
      ctx.fillStyle = '#ccff00';
      ctx.font = `bold 18px var(--font-mono), monospace`;
      ctx.fillText('CASHED OUT', w / 2, h / 2 + 36);
    }
  }, [crashed, cashedOut]);

  useEffect(() => {
    if (!running || crashed || cashedOut) return;
    startRef.current = performance.now();

    function tick() {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const mult = +(1 + elapsed * 1.2).toFixed(2);
      setMultiplier(mult);
      draw(mult);

      if (mult >= crashPoint) {
        setCrashed(true);
        setRunning(false);
        draw(mult);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, crashed, cashedOut, crashPoint, draw]);

  /* Initial draw */
  useEffect(() => { draw(1.0); }, [draw]);

  function start() {
    setMultiplier(1.0);
    setCrashed(false);
    setCashedOut(false);
    setRunning(true);
  }

  function cashOut() {
    if (!running || crashed) return;
    cancelAnimationFrame(rafRef.current);
    setCashedOut(true);
    setRunning(false);
    setScore(s => s + Math.round(100 * multiplier));
  }

  function reset() {
    cancelAnimationFrame(rafRef.current);
    setMultiplier(1.0);
    setCrashed(false);
    setCashedOut(false);
    setRunning(false);
    draw(1.0);
  }

  const s = {
    wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem' },
    canvas: { background: '#0a0a0a', borderRadius: 12, border: '1px solid var(--border)' },
    row: { display: 'flex', gap: '1rem' },
    btn: (bg) => ({
      fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.1em',
      padding: '0.6rem 2rem', background: bg, color: '#fff',
      borderRadius: 50, cursor: 'none', transition: 'transform 0.2s',
    }),
    score: { fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' },
  };

  return (
    <div style={s.wrap}>
      <span style={s.score}>Score: {score}</span>
      <canvas ref={canvasRef} width={400} height={280} style={s.canvas} />
      <div style={s.row}>
        {!running && !crashed && !cashedOut && (
          <button style={s.btn('var(--accent)')} onClick={start}>START</button>
        )}
        {running && (
          <button style={s.btn('#ccff00')} onClick={cashOut}>CASH OUT</button>
        )}
        {(crashed || cashedOut) && (
          <button style={s.btn('var(--accent)')} onClick={reset}>RESET</button>
        )}
      </div>
    </div>
  );
}
