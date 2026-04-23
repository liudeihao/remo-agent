import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SlideChrome, slideChrome } from "./SlideChrome";
import { highlightPatternsInCode } from "../lib/highlight";
import type { CodeSlide } from "../types/videoPlan";

export const CodeSlideView: React.FC<{
  slide: CodeSlide;
}> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const y = spring({ frame, fps, config: { damping: 16, mass: 0.45, stiffness: 100 }, from: 26, to: 0 });

  const highlights = slide.highlights;
  const borderGlow = 0.32;
  return (
    <SlideChrome videoSubtitle={slide.videoSubtitle}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          {slide.headline ? (
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                textShadow: "0 2px 20px rgba(0,0,0,0.4)",
              }}
            >
              {slide.headline}
            </div>
          ) : null}
          {slide.language ? (
            <div
              style={{
                fontSize: 18,
                letterSpacing: "0.12em",
                color: slideChrome.accent,
                border: `1px solid rgba(53,184,255,0.4)`,
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(53,184,255,0.1)",
              }}
            >
              {slide.language.toUpperCase()}
            </div>
          ) : null}
        </div>
        <div style={{ position: "relative", flex: 1, minHeight: 0, borderRadius: 18, overflow: "hidden" }}>
          <pre
            style={{
              margin: 0,
              height: "100%",
              overflow: "hidden",
              borderRadius: 18,
              border: `2px solid rgba(53,184,255,${borderGlow})`,
              background: "linear-gradient(180deg, rgba(0,12,20,0.9) 0%, rgba(0,0,0,0.55) 100%)",
              boxShadow: `0 0 50px rgba(53,184,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.04)`,
              padding: 36,
              fontSize: 30,
              lineHeight: 1.4,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Cascadia Code", monospace',
              color: slideChrome.ink,
            }}
          >
            <code>{highlightPatternsInCode(slide.code, highlights)}</code>
          </pre>
        </div>
      </div>
    </SlideChrome>
  );
};
