'use client';

import { useState, useCallback } from 'react';

const SIZE = 5;
const MINE_COUNT = 5;

function createBoard() {
  const mines = new Set();
  while (mines.size < MINE_COUNT) mines.add(Math.floor(Math.random() * SIZE * SIZE));
  return Array.from({ length: SIZE * SIZE }, (_, i) => ({
    isMine: mines.has(i),
    revealed: false,
  }));
}

export default function MinesGame() {
  const [board, setBoard] = useState(() => createBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);

  const reveal = useCallback((idx) => {
    if (gameOver || board[idx].revealed) return;
    const next = [...board];
    next[idx] = { ...next[idx], revealed: true };

    if (next[idx].isMine) {
      /* Reveal all mines */
      next.forEach((c, i) => { if (c.isMine) next[i] = { ...c, revealed: true }; });
      setBoard(next);
      setGameOver(true);
      setScore(0);
    } else {
      const newMult = +(multiplier + 0.25).toFixed(2);
      setMultiplier(newMult);
      setScore(s => s + Math.round(100 * newMult));
      setBoard(next);

      /* Check win */
      const safeLeft = next.filter(c => !c.isMine && !c.revealed).length;
      if (safeLeft === 0) setGameOver(true);
    }
  }, [board, gameOver, multiplier]);

  function reset() {
    setBoard(createBoard());
    setScore(0);
    setMultiplier(1.0);
    setGameOver(false);
  }

  const s = {
    wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem' },
    grid: { display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 56px)`, gap: 6 },
    cell: (c) => ({
      width: 56, height: 56, borderRadius: 8,
      display: 'grid', placeItems: 'center',
      background: c.revealed ? (c.isMine ? '#ff003c22' : '#00f3ff15') : '#1e1e1e',
      border: `1px solid ${c.revealed ? (c.isMine ? '#ff003c' : '#00f3ff44') : 'var(--border)'}`,
      fontSize: '1.4rem',
      transition: 'all 0.2s',
      cursor: 'none',
    }),
    bar: { display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' },
    label: { color: 'var(--text-dim)' },
    val: { color: 'var(--accent-cyan)', fontWeight: 700 },
    btn: {
      fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.1em',
      padding: '0.6rem 2rem', background: 'var(--accent)', color: '#fff',
      borderRadius: 50, cursor: 'none', transition: 'transform 0.2s',
    },
  };

  return (
    <div style={s.wrap}>
      <div style={s.bar}>
        <span><span style={s.label}>Score: </span><span style={s.val}>{score}</span></span>
        <span><span style={s.label}>x</span><span style={s.val}>{multiplier.toFixed(2)}</span></span>
      </div>
      <div style={s.grid}>
        {board.map((c, i) => (
          <button key={i} style={s.cell(c)} onClick={() => reveal(i)} disabled={gameOver || c.revealed}>
            {c.revealed ? (c.isMine ? '\u2716' : '\u2666') : ''}
          </button>
        ))}
      </div>
      {gameOver && (
        <button style={s.btn} onClick={reset}>
          {score > 0 ? 'Play Again' : 'Try Again'}
        </button>
      )}
    </div>
  );
}
