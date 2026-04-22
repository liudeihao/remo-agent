import React from "react";
import { SlideChrome, slideChrome } from "./SlideChrome";
import { useSlideEntrance } from "../lib/fade";
import type { CoverSlide } from "../types/brief";

export const CoverSlideView: React.FC<{ slide: CoverSlide }> = ({ slide }) => {
  const { opacity, translateY } = useSlideEntrance();
  return (
    <SlideChrome>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {slide.periodLabel ? (
          <div
            style={{
              alignSelf: "flex-start",
              letterSpacing: "0.18em",
              fontSize: 22,
              color: slideChrome.muted,
              border: `1px solid ${slideChrome.border}`,
              padding: "10px 14px",
              borderRadius: 999,
            }}
          >
            {slide.periodLabel}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 86,
            lineHeight: 1.05,
            fontWeight: 700,
            maxWidth: 1500,
          }}
        >
          {slide.title}
        </div>
        {slide.subtitle ? (
          <div style={{ fontSize: 34, color: slideChrome.muted, maxWidth: 1200 }}>
            {slide.subtitle}
          </div>
        ) : null}
        <div style={{ marginTop: 18, fontSize: 26, color: slideChrome.accent }}>
          INTEL BRIEF · REMOTION
        </div>
      </div>
    </SlideChrome>
  );
};
