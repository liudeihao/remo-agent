import React from "react";
import { SlideChrome, slideChrome } from "./SlideChrome";
import { useSlideEntrance } from "../lib/fade";
import { highlightPatternsInCode } from "../lib/highlight";
import type { CodeSlide } from "../types/brief";

export const CodeSlideView: React.FC<{
  slide: CodeSlide;
}> = ({ slide }) => {
  const { opacity, translateY } = useSlideEntrance();
  const highlights = slide.highlights;

  return (
    <SlideChrome>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          {slide.headline ? (
            <div style={{ fontSize: 40, fontWeight: 700 }}>{slide.headline}</div>
          ) : null}
          {slide.language ? (
            <div
              style={{
                fontSize: 18,
                letterSpacing: "0.12em",
                color: slideChrome.muted,
                border: `1px solid ${slideChrome.border}`,
                padding: "6px 10px",
                borderRadius: 999,
              }}
            >
              {slide.language.toUpperCase()}
            </div>
          ) : null}
        </div>
        <pre
          style={{
            margin: 0,
            flex: 1,
            overflow: "hidden",
            borderRadius: 16,
            border: `1px solid ${slideChrome.border}`,
            background: "rgba(0,0,0,0.35)",
            padding: 34,
            fontSize: 28,
            lineHeight: 1.35,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Cascadia Code", monospace',
            color: slideChrome.ink,
          }}
        >
          <code>{highlightPatternsInCode(slide.code, highlights)}</code>
        </pre>
      </div>
    </SlideChrome>
  );
};
