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

export type BriefSlide = CoverSlide | BulletsSlide | MediaSlide | CodeSlide;

export type IntelBriefProps = {
  fps?: number;
  width?: number;
  height?: number;
  /** Full mix narration (e.g. WAV from your TTS job). Remote HTTPS OK at render time. */
  narrationAudioUrl?: string;
  slides: BriefSlide[];
};

export const defaultBriefProps: IntelBriefProps = {
  fps: 30,
  width: 1920,
  height: 1080,
  slides: [
    {
      kind: "cover",
      durationInFrames: 90,
      title: "情报简报",
      subtitle: "在 props 里替换为真实标题",
      periodLabel: "DEMO",
    },
  ],
};
