export const BALL_R = 22;
export const RAMP = { x0: 340, y0: 200, x1: 960, y1: 520 } as const;
const dxR = RAMP.x1 - RAMP.x0;
const dyR = RAMP.y1 - RAMP.y0;
export const L_RAMP = Math.hypot(dxR, dyR);

export const SPRING = {
  cx: 960,
  baseY: 606,
  restHeight: 84,
  amplitude: 20,
  turns: 5.5,
} as const;

const tHat = { x: dxR / L_RAMP, y: dyR / L_RAMP };
const nUp = (() => {
  let nx = -tHat.y;
  let ny = tHat.x;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  return { x: nx, y: ny };
})();

/**
 * @param s path length along the ramp, 0 = top, L_RAMP = foot
 */
export function ballCenterOnRampClamped(sClamped: number): { x: number; y: number } {
  const f = Math.min(1, Math.max(0, sClamped / L_RAMP));
  const px = RAMP.x0 + f * dxR;
  const py = RAMP.y0 + f * dyR;
  return { x: px + nUp.x * BALL_R, y: py + nUp.y * BALL_R };
}

export const LAND_Y = ballCenterOnRampClamped(L_RAMP).y;
export const SPRING_TOP_Y = SPRING.baseY - SPRING.restHeight;
/** world anchor; distance to equilibrium ball center (LAND_Y) sets spring rest length */
export const SPRING_ANCHOR_Y = 600;
export const tHatX = tHat.x;
export const tHatY = tHat.y;
