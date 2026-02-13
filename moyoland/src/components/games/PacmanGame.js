'use client';

import { useRef, useEffect, useState } from 'react';

const CELL = 24;
const COLS = 15;
const ROWS = 15;
const W = COLS * CELL;
const H = ROWS * CELL;

/* 0 = wall, 1 = dot, 2 = empty, 3 = power */
const MAP_TEMPLATE = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,0,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,1,1,1,0,1,0,0,1,0],
  [0,3,0,0,1,0,1,0,1,0,1,0,0,3,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,1,0,0,2,2,2,0,0,1,0,1,0],
  [0,1,1,1,0,2,2,2,2,2,0,1,1,1,0],
  [0,0,0,1,0,2,0,0,0,2,0,1,0,0,0],
  [0,1,1,1,2,2,2,2,2,2,2,1,1,1,0],
  [0,1,0,1,0,0,2,2,2,0,0,1,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,1,0,1,0,1,0,0,1,0],
  [0,3,1,0,1,1,1,1,1,1,1,0,1,3,0],
  [0,1,1,1,1,1,1,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

export default function PacmanGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const stateRef = useRef({
    pac: { x: 7, y: 8, dir: 0 },
    ghosts: [
      { x: 6, y: 6, color: '#ff003c', dx: 0, dy: -1 },
      { x: 8, y: 6, color: '#00f3ff', dx: 0, dy: 1 },
    ],
    map: MAP_TEMPLATE.map(r => [...r]),
    score: 0,
    mouthOpen: true,
    frame: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function onKey(e) {
      const p = stateRef.current.pac;
      const dirs = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0], w:[0,-1], s:[0,1], a:[-1,0], d:[1,0] };
      const d = dirs[e.key];
      if (d) {
        e.preventDefault();
        p.nextDir = d;
      }
    }
    window.addEventListener('keydown', onKey);

    let raf;
    let tickCount = 0;

    function tick() {
      tickCount++;
      const st = stateRef.current;
      st.frame++;

      /* Move pacman every 8 frames */
      if (tickCount % 8 === 0) {
        const p = st.pac;
        if (p.nextDir) {
          const nx = p.x + p.nextDir[0];
          const ny = p.y + p.nextDir[1];
          if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && st.map[ny][nx] !== 0) {
            p.dir = p.nextDir;
          }
        }
        if (p.dir) {
          const nx = p.x + p.dir[0];
          const ny = p.y + p.dir[1];
          if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && st.map[ny][nx] !== 0) {
            p.x = nx;
            p.y = ny;
          }
        }
        /* Eat dot */
        if (st.map[p.y][p.x] === 1) { st.map[p.y][p.x] = 2; st.score += 10; setScore(st.score); }
        if (st.map[p.y][p.x] === 3) { st.map[p.y][p.x] = 2; st.score += 50; setScore(st.score); }
        st.mouthOpen = !st.mouthOpen;
      }

      /* Move ghosts every 12 frames */
      if (tickCount % 12 === 0) {
        st.ghosts.forEach(g => {
          const dirs = [[0,-1],[0,1],[-1,0],[1,0]].filter(d => {
            const nx = g.x + d[0], ny = g.y + d[1];
            return nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && st.map[ny][nx] !== 0;
          });
          if (dirs.length > 0) {
            const pick = dirs[Math.floor(Math.random() * dirs.length)];
            g.x += pick[0]; g.y += pick[1];
            g.dx = pick[0]; g.dy = pick[1];
          }
          /* Check collision */
          if (g.x === st.pac.x && g.y === st.pac.y) {
            setGameState('over');
          }
        });
      }

      /* Draw */
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      /* Map */
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const v = st.map[r][c];
          if (v === 0) {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
          } else if (v === 1) {
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (v === 3) {
            ctx.fillStyle = '#ff003c';
            ctx.beginPath();
            ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      /* Pacman */
      const px = st.pac.x * CELL + CELL / 2;
      const py = st.pac.y * CELL + CELL / 2;
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      const angle = st.pac.dir ? Math.atan2(st.pac.dir[1], st.pac.dir[0]) : 0;
      const mouth = st.mouthOpen ? 0.3 : 0.05;
      ctx.arc(px, py, CELL / 2 - 2, angle + mouth, angle + Math.PI * 2 - mouth);
      ctx.lineTo(px, py);
      ctx.fill();

      /* Ghosts */
      st.ghosts.forEach(g => {
        const gx = g.x * CELL + CELL / 2;
        const gy = g.y * CELL + CELL / 2;
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(gx, gy - 2, CELL / 2 - 3, Math.PI, 0);
        ctx.lineTo(gx + CELL / 2 - 3, gy + CELL / 2 - 3);
        ctx.lineTo(gx - CELL / 2 + 3, gy + CELL / 2 - 3);
        ctx.fill();
        /* Eyes */
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(gx - 3, gy - 3, 3, 0, Math.PI * 2);
        ctx.arc(gx + 3, gy - 3, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      if (gameState === 'playing') raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
  }, [gameState]);

  function restart() {
    stateRef.current = {
      pac: { x: 7, y: 8, dir: 0 },
      ghosts: [
        { x: 6, y: 6, color: '#ff003c', dx: 0, dy: -1 },
        { x: 8, y: 6, color: '#00f3ff', dx: 0, dy: 1 },
      ],
      map: MAP_TEMPLATE.map(r => [...r]),
      score: 0,
      mouthOpen: true,
      frame: 0,
    };
    setScore(0);
    setGameState('playing');
  }

  const s = {
    wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' },
    canvas: { borderRadius: 12, border: '1px solid var(--border)' },
    score: { fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' },
    hint: { fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' },
    btn: {
      fontFamily: 'var(--font-display)', fontSize: '0.75rem', padding: '0.6rem 2rem',
      background: 'var(--accent)', color: '#fff', borderRadius: 50, cursor: 'none',
    },
  };

  return (
    <div style={s.wrap}>
      <span style={s.score}>Score: <strong style={{ color: 'var(--accent-cyan)' }}>{score}</strong></span>
      <canvas ref={canvasRef} width={W} height={H} style={s.canvas} />
      {gameState === 'over' && <button style={s.btn} onClick={restart}>RESTART</button>}
      <span style={s.hint}>Arrow keys or WASD to move</span>
    </div>
  );
}
