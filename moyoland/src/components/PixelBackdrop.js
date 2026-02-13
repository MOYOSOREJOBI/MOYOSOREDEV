'use client';

export default function PixelBackdrop() {
  return (
    <div className="pixel-backdrop" aria-hidden="true">
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'fixed' }}>
        <filter id="scatter" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="7.13" />
          <feDisplacementMap in="SourceGraphic" scale="324" xChannelSelector="R" />
          <feBlend in2="SourceGraphic" />
        </filter>
        <filter id="dilate">
          <feMorphology operator="dilate" radius="6" />
        </filter>
      </svg>
      <div className="pixel-grad" />
    </div>
  );
}
