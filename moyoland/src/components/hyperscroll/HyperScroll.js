'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HyperScroll.module.css';

const CONFIG = {
  itemCount: 16,
  starCount: 120,
  zGap: 800,
  camSpeed: 3,
};
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

const TEXTS = ['MOYO', 'LAND', 'CODE', 'BUILD', 'DREAM', 'CREATE', 'DESIGN', 'FUTURE'];

export default function HyperScroll({ navItems = [] }) {
  const worldRef = useRef(null);
  const viewportRef = useRef(null);
  const fpsRef = useRef(null);
  const velRef = useRef(null);
  const coordRef = useRef(null);
  const itemsRef = useRef([]);
  const stateRef = useRef({ scroll: 0, velocity: 0, targetScroll: 0, mouseX: 0, mouseY: 0 });

  useEffect(() => {
    const world = worldRef.current;
    const viewport = viewportRef.current;
    if (!world || !viewport) return;

    const items = [];

    /* Create 3D items */
    for (let i = 0; i < CONFIG.itemCount; i++) {
      const el = document.createElement('div');
      el.className = styles.item;

      if (i % 4 === 0) {
        const txt = document.createElement('div');
        txt.className = styles.bigText;
        txt.innerText = TEXTS[i % TEXTS.length];
        el.appendChild(txt);
        items.push({ el, type: 'text', x: 0, y: 0, rot: 0, baseZ: -i * CONFIG.zGap });
      } else {
        const card = document.createElement('div');
        card.className = styles.card;
        card.innerHTML = `
          <div class="${styles.cardHeader}">
            <span>SECTOR-${String(i).padStart(2, '0')}</span>
            <div style="width:8px;height:8px;background:var(--accent)"></div>
          </div>
          <h2 class="${styles.cardTitle}">${TEXTS[i % TEXTS.length]}</h2>
          <div class="${styles.cardIdx}">0${i}</div>
        `;
        el.appendChild(card);

        const angle = (i / CONFIG.itemCount) * Math.PI * 6;
        items.push({
          el, type: 'card',
          x: Math.cos(angle) * (window.innerWidth * 0.28),
          y: Math.sin(angle) * (window.innerHeight * 0.28),
          rot: (Math.random() - 0.5) * 30,
          baseZ: -i * CONFIG.zGap,
        });
      }
      world.appendChild(el);
    }

    /* Stars */
    for (let i = 0; i < CONFIG.starCount; i++) {
      const el = document.createElement('div');
      el.className = styles.star;
      world.appendChild(el);
      items.push({
        el, type: 'star',
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        baseZ: -Math.random() * CONFIG.loopSize,
      });
    }

    itemsRef.current = items;

    /* Wheel scroll */
    function onWheel(e) {
      e.preventDefault();
      stateRef.current.targetScroll += e.deltaY * 1.2;
    }
    viewport.addEventListener('wheel', onWheel, { passive: false });

    /* Mouse */
    function onMouseMove(e) {
      stateRef.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      stateRef.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouseMove);

    /* RAF */
    let lastT = 0;
    let raf;

    function loop(time) {
      const dt = time - lastT;
      lastT = time;

      const st = stateRef.current;
      /* Smooth scroll interpolation */
      st.scroll += (st.targetScroll - st.scroll) * 0.08;
      st.velocity = (st.targetScroll - st.scroll) * 0.02;

      /* HUD */
      if (fpsRef.current && dt > 0) fpsRef.current.textContent = Math.round(1000 / dt);
      if (velRef.current) velRef.current.textContent = Math.abs(st.velocity).toFixed(2);
      if (coordRef.current) coordRef.current.textContent = Math.round(st.scroll);

      /* Camera tilt */
      const tiltX = st.mouseY * 4 - st.velocity * 0.3;
      const tiltY = st.mouseX * 4;
      world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      /* Warp perspective */
      const fov = 1000 - Math.min(Math.abs(st.velocity) * 8, 500);
      viewport.style.perspective = `${fov}px`;

      /* Render items */
      const camZ = st.scroll * CONFIG.camSpeed;
      const mod = CONFIG.loopSize;

      items.forEach(item => {
        let vizZ = ((item.baseZ + camZ) % mod + mod) % mod;
        if (vizZ > 500) vizZ -= mod;

        let alpha = 1;
        if (vizZ < -3000) alpha = 0;
        else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
        if (vizZ > 100 && item.type !== 'star') alpha = 1 - ((vizZ - 100) / 400);
        alpha = Math.max(0, Math.min(1, alpha));

        item.el.style.opacity = alpha;
        if (alpha <= 0) return;

        let t = `translate3d(${item.x}px,${item.y}px,${vizZ}px)`;
        if (item.type === 'star') {
          const stretch = Math.max(1, Math.min(1 + Math.abs(st.velocity) * 0.08, 8));
          t += ` scale3d(1,1,${stretch})`;
        } else if (item.type === 'text') {
          t += ` rotateZ(${item.rot}deg)`;
          if (Math.abs(st.velocity) > 1) {
            const off = st.velocity * 2;
            item.el.style.textShadow = `${off}px 0 #ff003c, ${-off}px 0 #00f3ff`;
          } else {
            item.el.style.textShadow = 'none';
          }
        } else {
          const f = Math.sin(time * 0.001 + item.x) * 8;
          t += ` rotateZ(${item.rot}deg) rotateY(${f}deg)`;
        }
        item.el.style.transform = t;
      });

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className={styles.wrap}>
      {/* Overlays */}
      <div className={styles.scanlines} />
      <div className={styles.vignette} />
      <div className={styles.noise} />

      {/* HUD */}
      <div className={styles.hud}>
        <div className={styles.hudRow}>
          <span>MOYOLAND.SYS</span>
          <div className={styles.hudLine} />
          <span>FPS: <strong ref={fpsRef}>60</strong></span>
        </div>
        <div className={styles.hudSide}>
          SCROLL VELOCITY // <strong ref={velRef}>0.00</strong>
        </div>
        <div className={styles.hudRow}>
          <span>COORD: <strong ref={coordRef}>0</strong></span>
          <div className={styles.hudLine} />
          <span>VER 2.0.5</span>
        </div>
      </div>

      {/* Navigation Cards */}
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className={styles.navItem}>
            <span className={styles.navLabel}>{item.label}</span>
            <span className={styles.navDesc}>{item.desc}</span>
          </a>
        ))}
      </nav>

      {/* 3D Viewport */}
      <div ref={viewportRef} className={styles.viewport}>
        <div ref={worldRef} className={styles.world} />
      </div>
    </div>
  );
}
