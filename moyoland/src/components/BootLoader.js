'use client';

import { useEffect, useState, useRef } from 'react';

/* ── Wizard sprite data ────────────────────────────
   Encoded as a compact grid. Each character maps to a color.
   · = transparent, o = black, H = hat, h = hat-dark,
   b = hat-darker, d = hat-darkest, E = eyes, e = eyes-dark,
   C = cloak, c = cloak-d1, x = cloak-d2, z = cloak-d3,
   P = pants1, p = pants1-dark, Q = pants2, q = pants2-dark, r = pants2-darker
   ────────────────────────────────────────────────── */

const PALETTE = {
  '.': null,
  'o': '#000000',
  'H': '#dfa74a', 'h': '#c88e3a', 'b': '#b07830', 'd': '#986228',
  'E': '#e0dfa3', 'e': '#9e9f6d',
  'C': '#5a82cd', 'c': '#4a6fb5', 'x': '#3b5d9d', 'z': '#2c4a85',
  'P': '#43872e', 'p': '#387226',
  'Q': '#a8a089', 'q': '#8f8774', 'r': '#766e5f',
};

const FRAME1 = [
  '.......................',
  '.............hH........',
  '...........hHHh........',
  '..........HHHhb........',
  '........bHHHhbd........',
  '.......bHHHHbbd........',
  '....hHhhHHHhbbdb.......',
  '..hHHHhHHHHhbbdhHh....',
  '.hHHHHHHHHHhbbbdbhHh..',
  '.hHHHHHHHHHHhbbbbbhHh.',
  '..HHHHHHHHHHHHhbbhHHHh',
  '..bHHHHHHHHHHHHHHHHHHh',
  '...bhHHHHHHHHHHHHHHHhd',
  '....dbhHHHHHHHHHHHHbdd',
  '......oEhhhHHHHHhbddd.',
  '.....zoeooebbhhhbdddd..',
  '....zzxoooeozzzzdd.....',
  '...zxzxxxxxzzzxzz......',
  '..zxxzzxxxxxxxxxz......',
  '..xCxxzzzzxxxxxxx.....',
  '.zxCCxxoxxxxxxCCxz....',
  '.xxCCCxozxxCCCCCCxx....',
  '.xxxCxoooxCCCCCCCCx....',
  '..zxxzqoozCCCCCCxxCx..',
  '...zxqQrooxCCCCxxxxxx..',
  '..zxzQQrroxCCxxxxxxx..',
  '..xxzPQPrqrxxxxxxxxxxz.',
  '.zxxorooPPqxxxxzzz.....',
  'zxCxddroProQxxxxzoxx...',
  'zxCzodbohroQQzooxxxxz..',
  'xCxohbdHHoroQrxxxxxxCx.',
  '.xxobhdddooqQrxxxCCCCxz',
  '..xHHhbbboohqrzxxCCCCCx',
  '..hHhbboooohdddxCCCCCxx',
  '.........oohddhxCCCxxz.',
  '..........obhddxCCxxxz.',
  '..........bhHHHzxxzz...',
  '..........bHHboozz.....',
  '...........HHbo........',
];

const PX = 5;
const COLS = 23;
const ROWS = 39;

export default function BootLoader() {
  const canvasRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = COLS * PX;
    canvas.height = ROWS * PX;

    let frame = 0;
    const shimmerSpeed = 0.06;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      for (let row = 0; row < ROWS; row++) {
        const line = FRAME1[row] || '';
        for (let col = 0; col < COLS; col++) {
          const ch = line[col];
          if (!ch || ch === '.' || ch === ' ') continue;
          const color = PALETTE[ch];
          if (!color) continue;

          /* Subtle shimmer: offset brightness per-pixel over time */
          const shimmer = Math.sin(frame * shimmerSpeed + row * 0.3 + col * 0.2) * 12;
          ctx.fillStyle = adjustBrightness(color, shimmer);
          ctx.fillRect(col * PX, row * PX, PX, PX);
        }
      }
    }

    const interval = setInterval(draw, 50);
    draw();

    /* Hide after 1.8s */
    const timer = setTimeout(() => setDone(true), 1800);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`boot-loader${done ? ' done' : ''}`}>
      <div className="wizard">
        <canvas ref={canvasRef} style={{ imageRendering: 'pixelated', width: COLS * PX * 2, height: ROWS * PX * 2 }} />
      </div>
      <span className="loading-label">Entering Moyoland...</span>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────── */
function adjustBrightness(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  let r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  let b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `rgb(${r|0},${g|0},${b|0})`;
}
