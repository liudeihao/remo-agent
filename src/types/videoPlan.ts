export type SlideBase = {
  durationInFrames: number;
  /** Optional TTS or pre-rendered narration for this segment */
  ttsText?: string;
  /**
   * Fixed bottom 字幕/旁白上屏（全 kind 可用）。与 `kind: "cover"` 的 `subtitle`（封面副标题）不同。
   */
  videoSubtitle?: string;
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
import type { SemanticIconName } from "../lib/semanticIcons";

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

/**
 * 图优先科普：能画出来的概念用图节点，关系用边。
 * `x` / `y`：节点**卡片中心**在**图区正方形画布**上的归一化坐标 (0–1)，与 `ExplainerGraphSlideView` 里 SVG
 * `viewBox` 0–1000 及 HTML 层叠节点共用同一域（无 letterbox/两套坐标时才能对齐到边的锚点）。
 */
export type ExplainerGraphNode = {
  id: string;
  x: number;
  y: number;
  imageUrl?: string;
  /** 无网络图时以大图标呈现该概念；与 imageUrl 二选一即可 */
  iconId?: SemanticIconName;
  /** 极短标签，可选；以图为主时尽量省略 */
  shortLabel?: string;
};

export type ExplainerGraphEdge = {
  from: string;
  to: string;
  label?: string;
  /**
   * Optional SVG user-space (same as graph `viewBox` 0–1000) stroke widths / arrow. Omit to use
   * `ExplainerGraphSlideView` defaults.
   */
  lineTrackWidth?: number;
  lineAccentWidth?: number;
  /** Tip scale in the same user units as the canvas (0–1000 field). */
  arrowHeadSize?: number;
  /** `false` = single stroke (accent only), no under-glow track. */
  showLineTrack?: boolean;
};

export type ExplainerGraphSlide = SlideBase & {
  kind: "explainerGraph";
  title?: string;
  nodes: ExplainerGraphNode[];
  edges: ExplainerGraphEdge[];
  /** 节点依次出现的间隔帧，默认 12 */
  revealStaggerFrames?: number;
  outroFadeFrames?: number;
};

export type TypewriterReveal = "word" | "char";

/**
 * 抽象内容：单行/单段文案，按词或按字显字；避免大段动效字墙。
 * 中文密集叙述优先 `char`；有空格分词时可用 `word`。
 */
export type TypewriterTextSlide = SlideBase & {
  kind: "typewriterText";
  title?: string;
  text: string;
  reveal: TypewriterReveal;
  /** 每显式一词或一字的间隔帧；默认 5（word）/ 2（char）@30fps 量级 */
  framesPerStep?: number;
  /** 正文从第几帧开始（给标题让路），默认 18 */
  textStartFrame?: number;
  outroFadeFrames?: number;
};

export type PlanSlide =
  | CoverSlide
  | BulletsSlide
  | MediaSlide
  | CodeSlide
  | KineticTextSlide
  | ExplainerGraphSlide
  | TypewriterTextSlide;

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
