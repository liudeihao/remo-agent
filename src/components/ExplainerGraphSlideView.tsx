import React, { useMemo } from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SemanticIconById, type SemanticIconName } from "../lib/semanticIcons";
import type { ExplainerGraphSlide } from "../types/videoPlan";
import { slideChrome, SlideChrome } from "./SlideChrome";

const graphH = 520;

function nodeVisualId(n: { imageUrl?: string; iconId?: SemanticIconName }): SemanticIconName {
  if (n.imageUrl) {
    return "none";
  }
  return n.iconId && n.iconId !== "none" ? n.iconId : "cogs";
}

export const ExplainerGraphSlideView: React.FC<{
  slide: ExplainerGraphSlide;
}> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const outro = slide.outroFadeFrames
    ? interpolate(
        frame,
        [
          slide.durationInFrames - slide.outroFadeFrames,
          slide.durationInFrames,
        ],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 1;
  const stagger = slide.revealStaggerFrames ?? 12;
  const hasTitle = Boolean(slide.title?.trim());
  const contentStart = hasTitle ? 18 : 0;
  const nodes = slide.nodes;
  const edges = slide.edges;

  const nodeStartFrame = (i: number) => contentStart + i * stagger;

  const bothReady = (fromId: string, toId: string) => {
    const a = nodes.findIndex((n) => n.id === fromId);
    const b = nodes.findIndex((n) => n.id === toId);
    if (a < 0 || b < 0) {
      return 0;
    }
    return Math.max(nodeStartFrame(a), nodeStartFrame(b)) + 6;
  };

  const edgeStartFrame = (e: { from: string; to: string }) => bothReady(e.from, e.to);

  const layout = useMemo(() => {
    return nodes.map((n) => ({
      x: Math.min(0.97, Math.max(0.03, n.x)) * 1000,
      y: Math.min(0.97, Math.max(0.03, n.y)) * 1000,
    }));
  }, [nodes]);

  return (
    <SlideChrome>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 16,
          opacity: outro,
        }}
      >
        {hasTitle && slide.title ? (
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: slideChrome.ink,
              maxWidth: 1500,
              marginBottom: 4,
            }}
          >
            {slide.title}
          </div>
        ) : null}

        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: graphH,
            flex: 1,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid meet"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              pointerEvents: "none",
            }}
            aria-hidden
          >
            {edges.map((e, ei) => {
              const ia = nodes.findIndex((n) => n.id === e.from);
              const ib = nodes.findIndex((n) => n.id === e.to);
              if (ia < 0 || ib < 0) {
                return null;
              }
              const p0 = layout[ia];
              const p1 = layout[ib];
              if (!p0 || !p1) {
                return null;
              }
              const startF = edgeStartFrame(e);
              const t = frame - startF;
              const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
              const vis = t < 0 ? 0 : spring({ frame: t, fps, config: { damping: 20, stiffness: 120 }, from: 0, to: 1 });
              const draw = vis * len;
              return (
                <g key={`${e.from}-${e.to}-${ei}`}>
                  <line
                    x1={p0.x}
                    y1={p0.y}
                    x2={p1.x}
                    y2={p1.y}
                    stroke={slideChrome.border}
                    strokeWidth="5"
                    strokeLinecap="round"
                    pathLength={len}
                    strokeDasharray={`${len}`}
                    strokeDashoffset={len - draw}
                    opacity={0.5 + 0.45 * vis}
                  />
                  <line
                    x1={p0.x}
                    y1={p0.y}
                    x2={p1.x}
                    y2={p1.y}
                    stroke={slideChrome.accent}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    pathLength={len}
                    strokeDasharray={`${len}`}
                    strokeDashoffset={len - draw}
                    opacity={0.35 + 0.5 * vis}
                  />
                </g>
              );
            })}
          </svg>

          {nodes.map((n, i) => {
            const t0 = nodeStartFrame(i);
            const t = frame - t0;
            const o = t < 0 ? 0 : spring({ frame: t, fps, config: { damping: 16, mass: 0.5, stiffness: 100 }, from: 0, to: 1 });
            const s = 0.88 + 0.12 * o;
            const visId = nodeVisualId(n);
            return (
              <div
                key={n.id}
                style={{
                  position: "absolute",
                  left: `${n.x * 100}%`,
                  top: `${n.y * 100}%`,
                  transform: `translate(-50%, -50%) scale(${t < 0 ? 0.9 : s})`,
                  opacity: t < 0 ? 0 : o,
                  width: 200,
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "rgba(14, 16, 22, 0.92)",
                  border: `1px solid ${slideChrome.border}`,
                  borderRadius: 20,
                  padding: 16,
                  boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 16,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(30, 34, 44, 0.9)",
                  }}
                >
                  {n.imageUrl ? (
                    <Img
                      src={n.imageUrl}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : visId !== "none" ? (
                    <SemanticIconById id={visId} size={96} />
                  ) : null}
                </div>
                {n.shortLabel ? (
                  <div
                    style={{
                      fontSize: 18,
                      color: slideChrome.muted,
                      textAlign: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    {n.shortLabel}
                  </div>
                ) : null}
              </div>
            );
          })}

          {edges.map((e, ei) => {
            const ia = nodes.findIndex((n) => n.id === e.from);
            const ib = nodes.findIndex((n) => n.id === e.to);
            if (ia < 0 || ib < 0 || !e.label) {
              return null;
            }
            const p0 = layout[ia];
            const p1 = layout[ib];
            if (!p0 || !p1) {
              return null;
            }
            const startF = edgeStartFrame(e) + 10;
            const t = frame - startF;
            const o = t < 0 ? 0 : interpolate(t, [0, 8], [0, 1], { extrapolateRight: "clamp" });
            const mx = ((p0.x + p1.x) / 2 / 1000) * 100;
            const my = ((p0.y + p1.y) / 2 / 1000) * 100;
            return o > 0.05 ? (
              <div
                key={`lbl-${e.from}-${e.to}-${ei}`}
                style={{
                  position: "absolute",
                  left: `${mx}%`,
                  top: `${my}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: 19,
                  color: slideChrome.muted,
                  background: "rgba(6,6,7,0.85)",
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: `1px solid ${slideChrome.border}`,
                  opacity: o,
                  maxWidth: 200,
                  textAlign: "center",
                }}
              >
                {e.label}
              </div>
            ) : null;
          })}
        </div>
      </div>
    </SlideChrome>
  );
};
