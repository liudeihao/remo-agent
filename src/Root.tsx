import React from "react";
import { Composition } from "remotion";
import { VideoFromPlan } from "./compositions/VideoFromPlan";
import { defaultVideoPlanProps, type VideoPlanProps } from "./types/videoPlan";

const planMetadata = async ({ props }: { props: unknown }) => {
  const p = props as VideoPlanProps;
  const fps = p.fps ?? 30;
  const durationInFrames = p.slides.reduce(
    (acc, s) => acc + s.durationInFrames,
    0,
  );
  return {
    durationInFrames: Math.max(durationInFrames, 1),
    fps,
    width: p.width ?? 1920,
    height: p.height ?? 1080,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoFromPlan"
        component={VideoFromPlan}
        defaultProps={defaultVideoPlanProps satisfies VideoPlanProps}
        calculateMetadata={planMetadata}
      />
    </>
  );
};
