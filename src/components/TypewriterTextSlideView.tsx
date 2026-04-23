import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TypewriterTextSlide } from "../types/videoPlan";
import { slideChrome, SlideChrome } from "./SlideChrome";

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter((w) => w.length > 0);
}

function visibleSlice(
  text: string,
  reveal: "word" | "char",
  stepsDone: number,
): string {
  if (reveal === "char") {
    return text.slice(0, Math.min(text.length, stepsDone));
  }
  const words = splitWords(text);
  if (words.length === 0) {
    return "";
  }
  if (reveal === "word") {
    // Re-join with single spaces (matches common CN/EN mix; for pure CN without spaces, use "char")
    return words.slice(0, Math.min(words.length, stepsDone)).join(" ");
  }
  return "";
}

function maxSteps(text: string, reveal: "word" | "char"): number {
  if (reveal === "char") {
    return text.length;
  }
  return Math.max(1, splitWords(text).length);
}

export const TypewriterTextSlideView: React.FC<{
  slide: TypewriterTextSlide;
}> = ({ slide }) => {
  const frame = useCurrentFrame();
  const outro = slide.outroFadeFrames
    ? interpolate(
        frame,
        [
          slide.durationInFrames - slide.outroFadeFrames,
          slide.durationInFrames,
        ],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 1;
  const hasTitle = Boolean(slide.title?.trim());
  const start = slide.textStartFrame ?? (hasTitle ? 18 : 0);
  const per =
    slide.framesPerStep ??
    (slide.reveal === "char" ? 2 : 5);
  const f = frame - start;
  const maxS = useMemo(
    () => maxSteps(slide.text, slide.reveal),
    [slide.text, slide.reveal],
  );
  const steps = f < 0 ? 0 : Math.min(maxS, Math.floor(f / per));
  const body = useMemo(
    () => visibleSlice(slide.text, slide.reveal, steps),
    [slide.text, slide.reveal, steps],
  );
  const titleOp = hasTitle
    ? interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  return (
    <SlideChrome videoSubtitle={slide.videoSubtitle}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          opacity: outro,
        }}
      >
        {hasTitle && slide.title ? (
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: slideChrome.ink,
              maxWidth: 1500,
              opacity: titleOp,
            }}
          >
            {slide.title}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 34,
            lineHeight: 1.6,
            color: slideChrome.ink,
            maxWidth: 1200,
            minHeight: 120,
            whiteSpace: "pre-wrap" as const,
            wordBreak: "break-word" as const,
          }}
        >
          {body}
          {f >= 0 && steps < maxS ? (
            <span style={{ color: slideChrome.accent, marginLeft: 2 }}>▍</span>
          ) : null}
        </div>
      </div>
    </SlideChrome>
  );
};
