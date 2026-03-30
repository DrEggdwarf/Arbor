/**
 * Shared chart utilities — single source of truth.
 * Used by all graph block components and modal editors.
 */

export const PALETTE = [
  "#E8A855", "#5B8FD4", "#2ecc71", "#e74c3c",
  "#9b59b6", "#1abc9c", "#e67e22", "#34495e",
];

/**
 * Format a number for display on chart axes / tooltips.
 * Supports negative values via abs option.
 */
export function formatValue(v) {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
  return String(Math.round(v * 100) / 100);
}

/**
 * Compute a nice round max and step for Y-axis ticks.
 * @param {number} maxVal - The raw maximum value in the data
 * @param {number} [steps=5] - Number of grid lines desired
 * @returns {{ max: number, step: number }}
 */
export function niceScale(maxVal, steps = 5) {
  if (maxVal <= 0) return { max: 10, step: 10 / steps };
  const rough = maxVal * 1.15;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const res = rough / mag;
  let nice;
  if (res <= 1.5) nice = 1.5 * mag;
  else if (res <= 3) nice = 3 * mag;
  else if (res <= 5) nice = 5 * mag;
  else if (res <= 7) nice = 7 * mag;
  else nice = 10 * mag;
  return { max: nice, step: nice / steps };
}

/**
 * Compute nice min/max/step for axes with negative values (scatter plots, etc.).
 */
export function niceScaleRange(minVal, maxVal, steps = 5) {
  const range = maxVal - minVal || 10;
  const rough = range * 1.15;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const res = rough / mag;
  let nice;
  if (res <= 2) nice = 2 * mag;
  else if (res <= 5) nice = 5 * mag;
  else nice = 10 * mag;
  const step = nice / steps;
  return {
    min: Math.floor(minVal / step) * step,
    max: Math.ceil(maxVal / step) * step,
    step,
  };
}

/**
 * Linearly interpolate between two hex colors.
 * @param {string} a - Start hex color (e.g. "#f0ede6")
 * @param {string} b - End hex color (e.g. "#e74c3c")
 * @param {number} t - Interpolation factor [0, 1]
 */
export function lerpColor(a, b, t) {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `rgb(${rr},${rg},${rb})`;
}
