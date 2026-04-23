/**
 * Shorten a segment from both ends (same direction), e.g. so arrow tips don't
 * sit inside node hit boxes. All coordinates in the same user space (e.g. SVG viewBox).
 */
export function shortenSegment(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  marginStart: number,
  marginEnd: number,
): { x0: number; y0: number; x1: number; y1: number; length: number } {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const L = Math.hypot(dx, dy);
  if (L < 1e-6) {
    return { x0, y0, x1, y1, length: 0 };
  }
  const need = marginStart + marginEnd;
  if (L <= need + 1e-3) {
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    return { x0: mx, y0: my, x1: mx, y1: my, length: 0 };
  }
  const ux = dx / L;
  const uy = dy / L;
  return {
    x0: x0 + ux * marginStart,
    y0: y0 + uy * marginStart,
    x1: x0 + ux * (L - marginEnd),
    y1: y0 + uy * (L - marginEnd),
    length: L - need,
  };
}
