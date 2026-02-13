'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './ProjectGrid.module.css';

const FLIP_SPEED = 700;

export default function ProjectGrid({ projects = [] }) {
  const galleryRef = useRef(null);
  const uniteRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');

  const sorted = [...projects]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0));

  const filtered = filterCategory === 'all'
    ? sorted
    : sorted.filter(p => p.category === filterCategory);

  const categories = ['all', ...new Set(projects.map(p => p.category))];

  const setImage = useCallback((el, idx) => {
    if (!el || !filtered[idx]) return;
    const src = `/assets/images/projects/${filtered[idx].img}`;
    el.style.backgroundImage = `url("${src}")`;
  }, [filtered]);

  const updateGallery = useCallback((idx, reverse = false) => {
    const unites = uniteRefs.current.filter(Boolean);
    unites.forEach((el, i) => {
      const delay = reverse
        ? (i === 1 || i === 2 ? 0 : FLIP_SPEED - 200)
        : (i === 1 || i === 2 ? FLIP_SPEED - 200 : 0);
      setTimeout(() => setImage(el, idx), delay);
    });
  }, [setImage]);

  /* Init first image */
  useEffect(() => {
    const start = Math.min(currentIndex, filtered.length - 1);
    uniteRefs.current.filter(Boolean).forEach(el => setImage(el, start));
  }, [filtered, currentIndex, setImage]);

  function navigate(dir) {
    if (filtered.length === 0) return;
    const next = (currentIndex + dir + filtered.length) % filtered.length;
    setCurrentIndex(next);
    updateGallery(next, dir < 0);
  }

  const current = filtered[currentIndex] || {};

  return (
    <div className={styles.container}>
      {/* Category Filter */}
      <div className={styles.filters}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${filterCategory === cat ? styles.active : ''}`}
            onClick={() => { setFilterCategory(cat); setCurrentIndex(0); }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid} ref={galleryRef}>
        {/* Flip Gallery */}
        <div className={styles.flipGallery}>
          <div className={styles.flipDivider} />
          {['top', 'bottom', 'overlayTop', 'overlayBottom'].map((pos, i) => (
            <div
              key={pos}
              ref={el => uniteRefs.current[i] = el}
              className={`${styles.unite} ${styles[pos]}`}
            />
          ))}
          {/* Info overlay */}
          <div className={styles.info}>
            <div className={styles.infoInner}>
              <a href={current.url || '#'} target="_blank" rel="noopener noreferrer" className={styles.projectTitle}>
                {current.title || 'Project Name'}
              </a>
              <p className={styles.projectDesc}>{current.description || ''}</p>
              {current.tech && (
                <div className={styles.techRow}>
                  {current.tech.map(t => (
                    <span key={t} className={styles.techTag}>{t}</span>
                  ))}
                </div>
              )}
              <div className={styles.stats}>
                <span>{current.likes || 0} likes</span>
                <span>{current.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navRow}>
          <button className={styles.navBtn} onClick={() => navigate(-1)}>&#10094;</button>
          <span className={styles.counter}>{currentIndex + 1} / {filtered.length}</span>
          <button className={styles.navBtn} onClick={() => navigate(1)}>&#10095;</button>
        </div>

        {/* Thumbnails */}
        <div className={styles.thumbs}>
          {filtered.map((p, i) => (
            <button
              key={`${p.title}-${i}`}
              className={`${styles.thumb} ${i === currentIndex ? styles.thumbActive : ''}`}
              style={{ backgroundImage: `url("/assets/images/projects/${p.img}")` }}
              onClick={() => { setCurrentIndex(i); updateGallery(i); }}
              title={p.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
