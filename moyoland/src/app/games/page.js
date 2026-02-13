'use client';

import { useState } from 'react';
import TopNav from '@/components/TopNav';
import WordleGame from '@/components/games/WordleGame';
import MinesGame from '@/components/games/MinesGame';
import CrashGame from '@/components/games/CrashGame';
import PlinkoGame from '@/components/games/PlinkoGame';
import PacmanGame from '@/components/games/PacmanGame';
import styles from './page.module.css';

const GAMES = [
  { id: 'wordle', label: 'Wordle', Component: WordleGame },
  { id: 'mines', label: 'Mines', Component: MinesGame },
  { id: 'crash', label: 'Crash', Component: CrashGame },
  { id: 'plinko', label: 'Plinko', Component: PlinkoGame },
  { id: 'pacman', label: 'Pacman', Component: PacmanGame },
];

export default function GamesPage() {
  const [active, setActive] = useState(null);

  return (
    <>
      <TopNav title="Game Arcade" />
      <main className={styles.page}>
        {!active ? (
          <div className={styles.grid}>
            {GAMES.map(g => (
              <button key={g.id} className={styles.card} onClick={() => setActive(g.id)}>
                <div className={styles.cardIcon}>{g.label[0]}</div>
                <h2 className={styles.cardLabel}>{g.label}</h2>
                <span className={styles.playHint}>PLAY</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.gameWrap}>
            <button className={styles.backBtn} onClick={() => setActive(null)}>
              ← Back to Arcade
            </button>
            {GAMES.find(g => g.id === active)?.Component && (
              (() => {
                const G = GAMES.find(g => g.id === active).Component;
                return <G />;
              })()
            )}
          </div>
        )}
      </main>
    </>
  );
}
