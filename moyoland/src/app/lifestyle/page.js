'use client';

import { useState } from 'react';
import TopNav from '@/components/TopNav';
import PageTurnBook from '@/components/lookbook/PageTurnBook';
import SoundPlayer from '@/components/audio/SoundPlayer';
import { SPORTS_TEAMS } from '@/content/site';
import { getLookbookImages } from '@/content/lookbook';
import styles from './page.module.css';

const TABS = ['Sports', 'Music', 'Fashion'];

export default function LifestylePage() {
  const [tab, setTab] = useState('Sports');

  return (
    <>
      <TopNav title="Lifestyle" />
      <main className={styles.page}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.activeTab : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {tab === 'Sports' && <SportsSection />}
          {tab === 'Music' && <SoundPlayer />}
          {tab === 'Fashion' && <PageTurnBook images={getLookbookImages()} />}
        </div>
      </main>
    </>
  );
}

function SportsSection() {
  return (
    <div className={styles.sportsWrap}>
      {/* Football */}
      <div className={styles.sportCategory}>
        <h2 className={styles.categoryTitle}>Football</h2>
        <div className={styles.teamGrid}>
          {SPORTS_TEAMS.football.map(t => (
            <div key={t.name} className={styles.teamCard}>
              <div className={styles.teamLogo}>
                <img src={t.logo} alt={t.name} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className={styles.teamInfo}>
                <span className={styles.teamName}>{t.name}</span>
                <span className={styles.teamLeague}>{t.league}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NFL */}
      <div className={styles.sportCategory}>
        <h2 className={styles.categoryTitle}>NFL</h2>
        <div className={styles.teamGrid}>
          {SPORTS_TEAMS.nfl.map(t => (
            <div key={t.name} className={styles.teamCard}>
              <div className={styles.teamLogo}>
                <img src={t.logo} alt={t.name} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className={styles.teamInfo}>
                <span className={styles.teamName}>{t.name}</span>
                <span className={styles.teamLeague}>{t.league}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NBA */}
      <div className={styles.sportCategory}>
        <h2 className={styles.categoryTitle}>NBA</h2>
        <div className={styles.teamGrid}>
          {SPORTS_TEAMS.nba.map(t => (
            <div key={t.name} className={styles.teamCard}>
              <div className={styles.teamLogo}>
                <img src={t.logo} alt={t.name} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className={styles.teamInfo}>
                <span className={styles.teamName}>{t.name}</span>
                <span className={styles.teamLeague}>{t.league}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Athletes */}
      <div className={styles.sportCategory}>
        <h2 className={styles.categoryTitle}>Athletes</h2>
        <div className={styles.teamGrid}>
          {SPORTS_TEAMS.athletes.map(a => (
            <div key={a.name} className={styles.teamCard}>
              <div className={styles.teamLogo}>
                <img src={a.photo} alt={a.name} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className={styles.teamInfo}>
                <span className={styles.teamName}>{a.name}</span>
                <span className={styles.teamLeague}>{a.sport}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className={styles.sportsHint}>
        Add team logos to public/assets/images/sports/. Live data integration coming soon.
      </p>
    </div>
  );
}
