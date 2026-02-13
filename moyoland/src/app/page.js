'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SOCIAL_LINKS } from '@/content/site';
import styles from './page.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  function handleEnter() {
    setExiting(true);
    setTimeout(() => router.push('/moyoland'), 800);
  }

  return (
    <main className={styles.landing}>
      <div className={`${styles.card} ${exiting ? styles.exit : ''}`}>
        <h1 className={styles.title} data-text="MOYOLAND">MOYOLAND</h1>
        <p className={styles.subtitle}>Portfolio of Moyosore Ogunjobi</p>
        <button className={styles.btn} onClick={handleEnter}>
          <span className={styles.btnInner}>WELCOME TO MOYOLAND</span>
        </button>
      </div>

      <nav className={styles.socials}>
        {SOCIAL_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </main>
  );
}
