'use client';

import Link from 'next/link';

export default function TopNav({ title }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.25rem 2rem',
      background: 'rgba(10,10,10,0.7)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <Link href="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
        transition: 'opacity 0.3s',
      }}>
        MOYOLAND
      </Link>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(0.7rem, 2vw, 1rem)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>
        {title}
      </span>
      <Link href="/moyoland" style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        opacity: 0.6,
        transition: 'opacity 0.3s',
      }}>
        HUB
      </Link>
    </nav>
  );
}
