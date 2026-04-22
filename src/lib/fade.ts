import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export function useSlideEntrance() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = spring({
    frame,
    fps,
    config: { damping: 18, mass: 0.5 },
    from: 18,
    to: 0,
  });
  return { opacity, translateY };
}
