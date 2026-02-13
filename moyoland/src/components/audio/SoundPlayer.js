'use client';

import { useRef, useState } from 'react';

/*
 * ── Audio Player ────────────────────────────────────
 * Drop your MP4 audio files in: public/audio/
 * If MP4 doesn't play, convert to M4A:
 *   ffmpeg -i input.mp4 -vn -c:a aac -b:a 192k public/audio/sound.m4a
 * ────────────────────────────────────────────────────
 */

export default function SoundPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function toggle() {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); }
    else { audioRef.current.play().catch(() => {}); }
    setPlaying(!playing);
  }

  function onTimeUpdate() {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0;
    setProgress(pct);
  }

  const s = {
    wrap: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '1.5rem', padding: '2rem',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 16, maxWidth: 400, width: '100%',
    },
    title: {
      fontFamily: 'var(--font-display)', fontSize: '1rem',
      letterSpacing: '0.1em', color: 'var(--text)',
    },
    hint: { fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.6 },
    bar: {
      width: '100%', height: 4, background: 'rgba(255,255,255,0.08)',
      borderRadius: 2, overflow: 'hidden',
    },
    fill: {
      height: '100%', background: 'var(--accent-cyan)',
      width: `${progress}%`, transition: 'width 0.2s linear',
    },
    btn: {
      width: 56, height: 56, borderRadius: '50%',
      background: playing ? 'var(--accent)' : 'var(--accent-cyan)',
      display: 'grid', placeItems: 'center',
      fontSize: '1.4rem', color: '#fff',
      cursor: 'none', transition: 'all 0.3s',
      border: 'none',
    },
    embed: {
      width: '100%', maxWidth: 400,
      borderRadius: 12, overflow: 'hidden',
      border: '1px solid var(--border)',
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      {/* Apple Music Embed Placeholder */}
      <div style={s.embed}>
        <p style={{ ...s.hint, padding: '2rem' }}>
          Replace the iframe src below with your Apple Music playlist URL.
          Go to Apple Music &gt; Share &gt; Copy Embed Code.
        </p>
        {/*
        <iframe
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          frameBorder="0"
          height="450"
          style={{ width: '100%', overflow: 'hidden', borderRadius: 10 }}
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src="https://embed.music.apple.com/us/playlist/YOUR-PLAYLIST-URL"
        />
        */}
      </div>

      {/* Local Audio Player */}
      <div style={s.wrap}>
        <span style={s.title}>Local Audio</span>
        <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={() => setPlaying(false)}>
          <source src="/audio/sound.mp4" type="audio/mp4" />
          <source src="/audio/sound.m4a" type="audio/mp4" />
          Your browser does not support the audio element.
        </audio>
        <div style={s.bar}><div style={s.fill} /></div>
        <button style={s.btn} onClick={toggle}>
          {playing ? '\u23F8' : '\u25B6'}
        </button>
        <p style={s.hint}>
          Drop MP4 files in public/audio/<br />
          If MP4 won't play, convert to M4A with ffmpeg
        </p>
      </div>
    </div>
  );
}
