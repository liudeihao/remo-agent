export type SlideBase = {
  durationInFrames: number;
  /** Optional TTS or pre-rendered narration for this segment */
  ttsText?: string;
};

export type CoverSlide = SlideBase & {
  kind: "cover";
  title: string;
  subtitle?: string;
  periodLabel?: string;
  /** Small footer line (e.g. show name). Omitted = no footer line. */
  brandFooter?: string;
};

export type BulletsSlide = SlideBase & {
  kind: "bullets";
  headline: string;
  /** One line per bullet */
  lines: string[];
  /** Substrings to emphasize (matched left-to-right, non-overlapping best-effort) */
  highlights?: string[];
};

export type MediaSlide = SlideBase & {
  kind: "media";
  headline?: string;
  imageUrl: string;
  caption?: string;
};

export type CodeSlide = SlideBase & {
  kind: "code";
  headline?: string;
  language?: string;
  code: string;
  /** Tokens / substrings to tint inside the snippet */
  highlights?: string[];
};

import type { KineticContentArc } from "../lib/kineticArc";

export type KineticTextLineAnim =
  | "staggerBounce"
  | "staggerFade"
  | "wordStagger"
  | "collide"
  | "driftTilt"
  | "floatIn";

export type { KineticContentArc };

/**
 * 科普/动效字：语义图标 + 叙事弧驱动动效。`frame` 在 Sequence 内从 0 起算。
 * 须提供 `contentArc` 或 `lineAnimation` 之一；若同时提供，以 `contentArc` 为准。
 */
export type KineticTextSlide = SlideBase & {
  kind: "kineticText";
  title?: string;
  lines: string[];
  lineAnimation?: KineticTextLineAnim;
  contentArc?: KineticContentArc;
  /** 高亮词前是否画语义小图标，默认 true */
  showSemanticIcons?: boolean;
  /** Delay between line (or group) starts；不设则随 contentArc 取默认 */
  staggerFrames?: number;
  highlights?: string[];
  /** 片尾渐隐，便于接下一镜（0 = 不渐隐） */
  outroFadeFrames?: number;
};

export type PlanSlide =
  | CoverSlide
  | BulletsSlide
  | MediaSlide
  | CodeSlide
  | KineticTextSlide;

/** Discriminator union tag for registered slide renderers. */
export type SlideKind = PlanSlide["kind"];

/** JSON props for multi-slide videos (slide registry in `src/slideRegistry.tsx`). */
export type VideoPlanProps = {
  fps?: number;
  width?: number;
  height?: number;
  /** Full mix narration (e.g. WAV from your TTS job). Remote HTTPS OK at render time. */
  narrationAudioUrl?: string;
  slides: PlanSlide[];
};

export const defaultVideoPlanProps: VideoPlanProps = {
  fps: 30,
  width: 1920,
  height: 1080,
  slides: [
    {
      kind: "cover",
      durationInFrames: 90,
      title: "视频标题",
      subtitle: "在 props 中替换为真实内容",
      periodLabel: "DEMO",
    },
  ],
};
