import React from "react";
import { Img } from "remotion";
import { SlideChrome, slideChrome } from "./SlideChrome";
import { useSlideEntrance } from "../lib/fade";
import type { MediaSlide } from "../types/videoPlan";

export const MediaSlideView: React.FC<{ slide: MediaSlide }> = ({ slide }) => {
  const { opacity, translateY } = useSlideEntrance();
  return (
    <SlideChrome>
      <div
        style={{
          height: "100%",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 22,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {slide.headline ? (
          <div style={{ fontSize: 46, fontWeight: 700 }}>{slide.headline}</div>
        ) : (
          <div />
        )}
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            border: `1px solid ${slideChrome.border}`,
            background: "rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={slide.imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        {slide.caption ? (
          <div style={{ fontSize: 28, color: slideChrome.muted }}>{slide.caption}</div>
        ) : (
          <div />
        )}
      </div>
    </SlideChrome>
  );
};
