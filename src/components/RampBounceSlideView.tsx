import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SlideChrome, slideChrome } from "./SlideChrome";
import type { RampBounceSlide } from "../types/videoPlan";

const BALL_R = 22;
const RAMP = {
  x0: 340,
  y0: 200,
  x1: 960,
  y1: 520,
} as const;

const SPRING = { x: RAMP.x1, y: RAMP.y1 };

function ballCenterOnRamp(progress: number): { cx: number; cy: number } {
  const t = Math.min(1, Math.max(0, progress));
  const dx = RAMP.x1 - RAMP.x0;
  const dy = RAMP.y1 - RAMP.y0;
  const len = Math.hypot(dx, dy);
  const tx = dx / len;
  const ty = dy / len;
  let nx = -ty;
  let ny = tx;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const px = RAMP.x0 + t * dx;
  const py = RAMP.y0 + t * dy;
  return {
    cx: px + nx * BALL_R,
    cy: py + ny * BALL_R,
  };
}

export const RampBounceSlideView: React.FC<{ slide: RampBounceSlide }> = ({
  slide,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rollEnd = 95;
  const contactStart = 95;
  const bounceStart = 108;

  const progress = interpolate(frame, [0, rollEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const onRamp = useMemo(
    () => ballCenterOnRamp(progress),
    [progress],
  );

  const compress = interpolate(
    frame,
    [contactStart, bounceStart],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const pressDown = frame >= contactStart && frame < bounceStart ? compress * 16 : 0;

  const bounceFrame = frame - bounceStart;
  const bounceUp =
    bounceFrame < 0
      ? 0
      : spring({
          frame: bounceFrame,
          fps,
          config: { damping: 9, mass: 0.45, stiffness: 130 },
        }) * 320;

  const wobbleX =
    bounceFrame < 0
      ? 0
      : spring({
          frame: bounceFrame,
          fps,
          config: { damping: 14, mass: 0.6, stiffness: 180 },
        }) * 36;

  const endCenter = useMemo(() => ballCenterOnRamp(1), []);

  const base =
    frame < contactStart
      ? { cx: onRamp.cx, cy: onRamp.cy }
      : { cx: endCenter.cx, cy: endCenter.cy };

  const ballCx = base.cx - pressDown * 0.25 + wobbleX;
  const ballCy = base.cy + pressDown - bounceUp;

  const springScaleY =
    1 - interpolate(frame, [contactStart, bounceStart], [0, 0.32], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const activeCue = slide.subtitleCues.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame,
  );

  return (
    <SlideChrome>
      <AbsoluteFill
        style={{
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="rampgrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <radialGradient id="ballgrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
          </defs>

          <line
            x1={RAMP.x0}
            y1={RAMP.y0}
            x2={RAMP.x1}
            y2={RAMP.y1}
            stroke="url(#rampgrad)"
            strokeWidth={30}
            strokeLinecap="round"
          />
          <line
            x1={RAMP.x0}
            y1={RAMP.y0}
            x2={RAMP.x1}
            y2={RAMP.y1}
            stroke={slideChrome.border}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.55}
          />

          <g
            transform={`translate(${SPRING.x} ${SPRING.y + 12}) scale(1, ${Math.max(0.68, springScaleY)})`}
          >
            <path
              d="M -50 0 Q -32 -16 -16 0 T 20 0 T 56 0 T 90 0 L 90 18 L -50 18 Z"
              fill="none"
              stroke={slideChrome.accent}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <rect x={-2} y={-6} width={94} height={8} fill="#475569" rx={2} />
          </g>

          <circle
            cx={ballCx}
            cy={ballCy}
            r={BALL_R}
            fill="url(#ballgrad)"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={2}
            style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" }}
          />
        </svg>

        {activeCue ? (
          <div
            style={{
              position: "absolute",
              left: 64,
              right: 64,
              bottom: 88,
              textAlign: "center",
              fontSize: 30,
              lineHeight: 1.4,
              color: slideChrome.ink,
              padding: "16px 24px",
              backgroundColor: "rgba(6, 6, 7, 0.78)",
              border: `1px solid ${slideChrome.border}`,
              borderRadius: 12,
            }}
          >
            {activeCue.text}
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 20,
            color: slideChrome.muted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          ball · ramp · spring
        </div>
      </AbsoluteFill>
    </SlideChrome>
  );
};
