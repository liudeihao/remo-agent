import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import { renderSlideContent } from "../slideRegistry";
import type { VideoPlanProps } from "../types/videoPlan";

/**
 * Generic JSON-driven composition: sequences slides from the registry and
 * optionally plays one mixed narration track.
 */
export const VideoFromPlan: React.FC<VideoPlanProps> = (props) => {
  let from = 0;
  const sequences = props.slides.map((slide, idx) => {
    const start = from;
    from += slide.durationInFrames;
    const key = `${slide.kind}-${idx}`;
    return (
      <Sequence key={key} from={start} durationInFrames={slide.durationInFrames}>
        {renderSlideContent(slide)}
      </Sequence>
    );
  });

  const narration = props.narrationAudioUrl;

  return (
    <AbsoluteFill>
      {narration ? <Audio src={narration} /> : null}
      {sequences}
    </AbsoluteFill>
  );
};
