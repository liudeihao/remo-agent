import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { simulateMatterToFrame } from "../physics/matterRampBounceSim";
import { BALL_R, RAMP, SPRING } from "../physics/rampBounceConfig";
import { SlideChrome, slideChrome } from "./SlideChrome";
import type { RampBounceSlide } from "../types/videoPlan";

const STEPS = 80;

function verticalCoilPathD(
  cx: number,
  baseY: number,
  topY: number,
  amplitude: number,
  turns: number,
): string {
  if (baseY <= topY) {
    return "";
  }
  const h = baseY - topY;
  let d = "";
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const y = baseY - t * h;
    const x = cx + amplitude * Math.sin(turns * 2 * Math.PI * t);
    d += (i === 0 ? "M" : "L") + ` ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d.trim();
}

export const RampBounceSlideView: React.FC<{ slide: RampBounceSlide }> = ({
  slide,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const w = useMemo(() => simulateMatterToFrame(frame, fps), [frame, fps]);
  const coilD = useMemo(
    () =>
      verticalCoilPathD(
        SPRING.cx,
        SPRING.baseY,
        w.springTopY,
        SPRING.amplitude,
        SPRING.turns,
      ),
    [w.springTopY],
  );

  const platformLeft = SPRING.cx - 56;
  const platformW = 112;
  const label =
    w.mode === "ramp"
      ? "Matter 斜面"
      : w.mode === "contact"
        ? "Constraint 簧"
        : "Matter 抛体";

  const activeCue = slide.subtitleCues.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame,
  );

  return (
    <SlideChrome>
      <AbsoluteFill
        style={{ overflow: "hidden", display: "flex", alignItems: "center" }}
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
            <linearGradient id="platform" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3d4f63" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          <g transform={`translate(${w.camX} ${w.camY})`}>
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

            <rect
              x={platformLeft - 24}
              y={SPRING.baseY - 2}
              width={platformW + 48}
              height={10}
              fill="url(#platform)"
              stroke={slideChrome.border}
              strokeWidth={1}
              rx={2}
            />
            <line
              x1={200}
              y1={SPRING.baseY + 10}
              x2={1500}
              y2={SPRING.baseY + 10}
              stroke="#334155"
              strokeWidth={2}
              opacity={0.5}
            />

            <path
              d={coilD}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={coilD}
              fill="none"
              stroke={slideChrome.accent}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <line
              x1={SPRING.cx - 36}
              y1={w.springTopY}
              x2={SPRING.cx + 36}
              y2={w.springTopY}
              stroke="#64748b"
              strokeWidth={4}
              strokeLinecap="round"
            />

            <circle
              cx={w.x}
              cy={w.y}
              r={BALL_R}
              fill="url(#ballgrad)"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={2}
              style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" }}
            />
          </g>
        </svg>

        {activeCue ? (
          <div
            style={{
              position: "absolute",
              left: 64,
              right: 64,
              bottom: 44,
              textAlign: "center",
              fontSize: 24,
              lineHeight: 1.4,
              color: slideChrome.ink,
              padding: "10px 18px",
              backgroundColor: "rgba(6, 6, 7, 0.88)",
              border: `1px solid ${slideChrome.border}`,
              borderRadius: 10,
            }}
          >
            {activeCue.text}
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 16,
            color: slideChrome.muted,
          }}
        >
          {label} · 跟拍 · matter-js
        </div>
      </AbsoluteFill>
    </SlideChrome>
  );
};
