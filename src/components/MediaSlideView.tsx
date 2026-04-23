import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { SlideChrome, slideChrome } from "./SlideChrome";
import { useSlideEntrance } from "../lib/fade";
import type { MediaSlide } from "../types/videoPlan";

export const MediaSlideView: React.FC<{ slide: MediaSlide }> = ({ slide }) => {
  const { opacity, translateY } = useSlideEntrance();
  const frame = useCurrentFrame();
  const breathe = 1.04 + 0.06 * (0.5 + 0.5 * Math.sin(frame * 0.035));
  const panX = interpolate(frame, [0, 180], [0, -1.2], { extrapolateRight: "extend" });
  const panY = interpolate(frame, [0, 180], [0, 0.6], { extrapolateRight: "extend" });
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
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              textShadow: "0 2px 24px rgba(0,0,0,0.5)",
            }}
          >
            {slide.headline}
          </div>
        ) : (
          <div />
        )}
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: `2px solid ${slideChrome.border}`,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 80px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${breathe}) translate(${panX}%, ${panY}%)`,
            }}
          >
            <Img
              src={slide.imageUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
        {slide.caption ? (
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: slideChrome.muted,
              animation: "none",
            }}
          >
            {slide.caption}
          </div>
        ) : (
          <div />
        )}
      </div>
    </SlideChrome>
  );
};
