/*
 * ── Lookbook Images ────────────────────────────────
 *
 * Add your fashion images to: public/assets/lookbook/
 * Name them: look-001.jpg, look-002.jpg, etc.
 *
 * Update TOTAL_LOOKS with your actual count.
 * ────────────────────────────────────────────────────
 */

export const TOTAL_LOOKS = 100;

export function getLookbookImages() {
  return Array.from({ length: TOTAL_LOOKS }, (_, i) => ({
    src: `/assets/lookbook/look-${String(i + 1).padStart(3, '0')}.jpg`,
    alt: `Look ${i + 1}`,
  }));
}
