'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

const W = 400;
const H = 500;
const ROWS = 10;
const PIN_R = 4;
const BALL_R = 6;
const GRAVITY = 0.25;
const BOUNCE = 0.6;
const MULTIPLIERS = [5, 3, 2, 1.5, 1, 0.5, 1, 1.5, 2, 3, 5];

export default function PlinkoGame() {
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const [score, setScore] = useState(0);
  const [lastMult, setLastMult] = useState(null);

  const getPins = useCallback(() => {
    const pins = [];
    const startY = 60;
    const rowH = (H - 120) / ROWS;
    for (let row = 0; row < ROWS; row++) {
      const count = row + 3;
      const rowW = count * 32;
      const startX = (W - rowW) / 2 + 16;
      for (let col = 0; col < count; col++) {
        pins.push({ x: startX + col * 32, y: startY + row * rowH });
      }
    }
    return pins;
  }, []);

  const pins = useRef(getPins());

  const dropBall = useCallback(() => {
    const x = W / 2 + (Math.random() - 0.5) * 20;
    ballsRef.current.push({ x, y: 10, vx: 0, vy: 0, active: true });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    function tick() {
      ctx.clearRect(0, 0, W, H);

      /* Draw pins */
      ctx.fillStyle = '#333';
      pins.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, PIN_R, 0, Math.PI * 2);
        ctx.fill();
      });

      /* Draw slots */
      const slotW = W / MULTIPLIERS.length;
      MULTIPLIERS.forEach((m, i) => {
        const x = i * slotW;
        ctx.fillStyle = m >= 3 ? 'rgba(255,0,60,0.2)' : m >= 1.5 ? 'rgba(0,243,255,0.12)' : 'rgba(255,255,255,0.05)';
        ctx.fillRect(x, H - 40, slotW, 40);
        ctx.fillStyle = m >= 3 ? '#ff003c' : '#00f3ff';
        ctx.font = 'bold 11px var(--font-mono), monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${m}x`, x + slotW / 2, H - 16);
      });

      /* Update balls */
      ballsRef.current.forEach(ball => {
        if (!ball.active) return;
        ball.vy += GRAVITY;
        ball.x += ball.vx;
        ball.y += ball.vy;

        /* Pin collisions */
        pins.current.forEach(p => {
          const dx = ball.x - p.x;
          const dy = ball.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < PIN_R + BALL_R) {
            const nx = dx / dist;
            const ny = dy / dist;
            ball.x = p.x + nx * (PIN_R + BALL_R);
            ball.y = p.y + ny * (PIN_R + BALL_R);
            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx -= 2 * dot * nx * BOUNCE;
            ball.vy -= 2 * dot * ny * BOUNCE;
            ball.vx += (Math.random() - 0.5) * 1.5;
          }
        });

        /* Walls */
        if (ball.x < BALL_R) { ball.x = BALL_R; ball.vx *= -0.5; }
        if (ball.x > W - BALL_R) { ball.x = W - BALL_R; ball.vx *= -0.5; }

        /* Landing */
        if (ball.y >= H - 40) {
          ball.active = false;
          const slot = Math.min(Math.floor(ball.x / (W / MULTIPLIERS.length)), MULTIPLIERS.length - 1);
          const mult = MULTIPLIERS[slot];
          setLastMult(mult);
          setScore(s => s + Math.round(100 * mult));
        }

        /* Draw ball */
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
        ctx.fill();
      });

      /* Cleanup old balls */
      ballsRef.current = ballsRef.current.filter(b => b.active || b.y < H + 20);

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const s = {
    wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' },
    canvas: { background: '#0a0a0a', borderRadius: 12, border: '1px solid var(--border)' },
    row: { display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' },
    btn: {
      fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.1em',
      padding: '0.6rem 2rem', background: 'var(--accent)', color: '#fff',
      borderRadius: 50, cursor: 'none',
    },
  };

  return (
    <div style={s.wrap}>
      <div style={s.row}>
        <span>Score: <strong style={{ color: 'var(--accent-cyan)' }}>{score}</strong></span>
        {lastMult !== null && <span>Last: <strong style={{ color: lastMult >= 3 ? '#ff003c' : '#00f3ff' }}>{lastMult}x</strong></span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H} style={s.canvas} />
      <button style={s.btn} onClick={dropBall}>DROP BALL</button>
    </div>
  );
}
