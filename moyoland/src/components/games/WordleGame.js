'use client';

import { useState, useEffect, useCallback } from 'react';

const WORDS = ['REACT','STACK','CLOUD','PIXEL','LOGIC','ARRAY','DEBUG','FLASK','QUERY','SWIFT','CARGO','MUTEX','REGEX','PROXY','ASYNC'];
const ROWS = 6;
const COLS = 5;

export default function WordleGame() {
  const [target] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const submit = useCallback(() => {
    if (current.length !== COLS || gameOver) return;
    const newGuesses = [...guesses, current];
    setGuesses(newGuesses);
    if (current === target) { setWon(true); setGameOver(true); }
    else if (newGuesses.length >= ROWS) { setGameOver(true); }
    setCurrent('');
  }, [current, guesses, gameOver, target]);

  useEffect(() => {
    function onKey(e) {
      if (gameOver) return;
      if (e.key === 'Enter') return submit();
      if (e.key === 'Backspace') return setCurrent(c => c.slice(0, -1));
      if (/^[a-zA-Z]$/.test(e.key) && current.length < COLS) {
        setCurrent(c => c + e.key.toUpperCase());
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, gameOver, submit]);

  function getColor(guess, i) {
    const letter = guess[i];
    if (letter === target[i]) return '#538d4e';
    if (target.includes(letter)) return '#b59f3b';
    return '#3a3a3c';
  }

  const s = {
    wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' },
    row: { display: 'flex', gap: '5px' },
    cell: (bg) => ({
      width: 52, height: 52, display: 'grid', placeItems: 'center',
      border: `2px solid ${bg || '#3a3a3c'}`,
      background: bg || 'transparent',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: '#fff',
      transition: 'all 0.3s',
    }),
    msg: { fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginTop: '1rem', color: 'var(--accent-cyan)' },
    hint: { fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.5rem' },
  };

  return (
    <div style={s.wrap}>
      {Array.from({ length: ROWS }).map((_, row) => {
        const guess = guesses[row];
        const isCurrent = row === guesses.length;
        return (
          <div key={row} style={s.row}>
            {Array.from({ length: COLS }).map((_, col) => {
              const letter = guess ? guess[col] : (isCurrent ? current[col] : '');
              const bg = guess ? getColor(guess, col) : undefined;
              return <div key={col} style={s.cell(bg)}>{letter || ''}</div>;
            })}
          </div>
        );
      })}
      {gameOver && (
        <p style={s.msg}>{won ? 'You got it!' : `The word was ${target}`}</p>
      )}
      <p style={s.hint}>Type to guess, Enter to submit</p>
    </div>
  );
}
