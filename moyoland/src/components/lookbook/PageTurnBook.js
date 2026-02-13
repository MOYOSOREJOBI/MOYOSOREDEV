'use client';

import { useState, useCallback } from 'react';
import styles from './PageTurnBook.module.css';

export default function PageTurnBook({ images = [] }) {
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(null);
  const totalSpreads = Math.ceil(images.length / 2);

  const turn = useCallback((dir) => {
    if (turning) return;
    const next = page + dir;
    if (next < 0 || next >= totalSpreads) return;
    setTurning(dir > 0 ? 'forward' : 'back');
    setTimeout(() => {
      setPage(next);
      setTurning(null);
    }, 500);
  }, [page, totalSpreads, turning]);

  const leftIdx = page * 2;
  const rightIdx = page * 2 + 1;
  const leftImg = images[leftIdx];
  const rightImg = images[rightIdx];

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Add your fashion images to</p>
        <code>public/assets/lookbook/</code>
        <p>Named: look-001.jpg, look-002.jpg, etc.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.book}>
        {/* Spine */}
        <div className={styles.spine} />

        {/* Left page */}
        <div
          className={`${styles.page} ${styles.left} ${turning === 'back' ? styles.turningBack : ''}`}
          onClick={() => turn(-1)}
        >
          {leftImg && (
            <img src={leftImg.src} alt={leftImg.alt} className={styles.img} />
          )}
          <span className={styles.pageNum}>{leftIdx + 1}</span>
        </div>

        {/* Right page */}
        <div
          className={`${styles.page} ${styles.right} ${turning === 'forward' ? styles.turningFwd : ''}`}
          onClick={() => turn(1)}
        >
          {rightImg && (
            <img src={rightImg.src} alt={rightImg.alt} className={styles.img} />
          )}
          <span className={styles.pageNum}>{rightIdx + 1}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.nav}>
        <button
          className={styles.navBtn}
          onClick={() => turn(-1)}
          disabled={page === 0}
        >
          &#10094;
        </button>
        <span className={styles.indicator}>
          {page + 1} / {totalSpreads}
        </span>
        <button
          className={styles.navBtn}
          onClick={() => turn(1)}
          disabled={page >= totalSpreads - 1}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
