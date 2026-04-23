import React from "react";
import { SlideChrome, slideChrome } from "./SlideChrome";
import { useSlideEntrance } from "../lib/fade";
import { renderLineWithHighlights } from "../lib/highlight";
import type { BulletsSlide } from "../types/videoPlan";

const markStyle: React.CSSProperties = {
  background: "rgba(53, 184, 255, 0.18)",
  color: slideChrome.accent,
  padding: "0 8px",
  borderRadius: 8,
};

export const BulletsSlideView: React.FC<{ slide: BulletsSlide }> = ({
  slide,
}) => {
  const { opacity, translateY } = useSlideEntrance();
  return (
    <SlideChrome>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 34,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, maxWidth: 1500 }}>
          {slide.headline}
        </div>
        <ul
          style={{
            margin: 0,
            padding: "10px 0 0 34px",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            fontSize: 34,
            lineHeight: 1.35,
            color: slideChrome.ink,
          }}
        >
          {slide.lines.map((line, idx) => (
            <li key={idx} style={{ paddingRight: 40 }}>
              {renderLineWithHighlights(line, slide.highlights, markStyle)}
            </li>
          ))}
        </ul>
      </div>
    </SlideChrome>
  );
};
