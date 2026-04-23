import type { KineticTextLineAnim } from "../types/videoPlan";

/**
 * 叙事弧 → 动效与布局：以内容决定节奏，不随便堆特效。
 * - mechanism：三条因果时用横向「机制链」；否则仍是竖条。
 * - dialectic：对撞 = 两股论述交锋。
 * - metaphor：微扭 = 接抽象比喻。
 */
export type KineticContentArc =
  | "setup"
  | "pressure"
  | "mechanism"
  | "dialectic"
  | "metaphor"
  | "application"
  | "closing";

export function resolveKineticFromArc(arc: KineticContentArc): {
  lineAnimation: KineticTextLineAnim;
  staggerFrames: number;
  useMechanismChain: boolean;
} {
  switch (arc) {
    case "setup":
      return { lineAnimation: "floatIn", staggerFrames: 5, useMechanismChain: false };
    case "pressure":
      return { lineAnimation: "staggerBounce", staggerFrames: 6, useMechanismChain: false };
    case "mechanism":
      return { lineAnimation: "staggerBounce", staggerFrames: 6, useMechanismChain: true };
    case "dialectic":
      return { lineAnimation: "collide", staggerFrames: 5, useMechanismChain: false };
    case "metaphor":
      return { lineAnimation: "driftTilt", staggerFrames: 7, useMechanismChain: false };
    case "application":
      return { lineAnimation: "staggerFade", staggerFrames: 7, useMechanismChain: false };
    case "closing":
      return { lineAnimation: "staggerFade", staggerFrames: 8, useMechanismChain: false };
    default: {
      const _x: never = arc;
      return _x;
    }
  }
}

export function getEffectiveKinetic(
  lineAnimation: KineticTextLineAnim | undefined,
  contentArc: KineticContentArc | undefined,
  linesLen: number,
): {
  lineAnimation: KineticTextLineAnim;
  staggerFrames: number;
  useMechanismChain: boolean;
} {
  if (contentArc) {
    const r = resolveKineticFromArc(contentArc);
    const chainOk = r.useMechanismChain && linesLen === 3;
    return {
      ...r,
      useMechanismChain: chainOk,
    };
  }
  return {
    lineAnimation: lineAnimation ?? "staggerBounce",
    staggerFrames: 5,
    useMechanismChain: false,
  };
}
