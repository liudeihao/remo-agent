import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import { CoverSlideView } from "../components/CoverSlideView";
import { BulletsSlideView } from "../components/BulletsSlideView";
import { MediaSlideView } from "../components/MediaSlideView";
import { CodeSlideView } from "../components/CodeSlideView";
import type { IntelBriefProps } from "../types/brief";

export const IntelBrief: React.FC<IntelBriefProps> = (props) => {
  let from = 0;
  const sequences = props.slides.map((slide, idx) => {
    const start = from;
    from += slide.durationInFrames;
    const key = `${slide.kind}-${idx}`;
    const inner =
      slide.kind === "cover" ? (
        <CoverSlideView slide={slide} />
      ) : slide.kind === "bullets" ? (
        <BulletsSlideView slide={slide} />
      ) : slide.kind === "media" ? (
        <MediaSlideView slide={slide} />
      ) : (
        <CodeSlideView slide={slide} />
      );
    return (
      <Sequence key={key} from={start} durationInFrames={slide.durationInFrames}>
        {inner}
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
