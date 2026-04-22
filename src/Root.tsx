import React from "react";
import { Composition } from "remotion";
import { IntelBrief } from "./compositions/IntelBrief";
import { defaultBriefProps, type IntelBriefProps } from "./types/brief";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IntelBrief"
        component={IntelBrief}
        defaultProps={defaultBriefProps satisfies IntelBriefProps}
        calculateMetadata={async ({ props }) => {
          const p = props as IntelBriefProps;
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
        }}
      />
    </>
  );
};
