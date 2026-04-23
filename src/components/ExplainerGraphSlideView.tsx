import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SemanticIconById, type SemanticIconName } from "../lib/semanticIcons";
import type { ExplainerGraphSlide } from "../types/videoPlan";
import { DirectedArrowEdgeSvg } from "./diagram/DirectedArrowEdgeSvg";
import { slideChrome, SlideChrome } from "./SlideChrome";

/** Fills frame — graph is the hero, not a PPT inset */
const GRAPH_MIN_H = 680;
const NODE_CARD_W = 320;
/** Match `minHeight: NODE_CARD_W * 0.95` on the card for shorten math */
const NODE_EST_H = NODE_CARD_W * 0.95;
const ICON_BOX = 220;
const ICON_SIZE = 170;
const VIEW = 1000;

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
  const contentStart = hasTitle ? 22 : 0;
  const nodes = slide.nodes;
  const edges = slide.edges;

  const nodeStartFrame = (i: number) => contentStart + i * stagger;

  const bothReady = (fromId: string, toId: string) => {
    const a = nodes.findIndex((n) => n.id === fromId);
    const b = nodes.findIndex((n) => n.id === toId);
    if (a < 0 || b < 0) {
      return 0;
    }
    return Math.max(nodeStartFrame(a), nodeStartFrame(b)) + 8;
  };

  const edgeStartFrame = (e: { from: string; to: string }) => bothReady(e.from, e.to);

  const layout = useMemo(() => {
    return nodes.map((n) => ({
      x: Math.min(0.97, Math.max(0.03, n.x)) * VIEW,
      y: Math.min(0.97, Math.max(0.03, n.y)) * VIEW,
    }));
  }, [nodes]);

  const titleY = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.45 },
    from: 28,
    to: 0,
  });
  const titleOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  const graphRowRef = useRef<HTMLDivElement>(null);
  const [sidePx, setSidePx] = useState(800);
  useLayoutEffect(() => {
    const row = graphRowRef.current;
    if (!row) {
      return;
    }
    const update = (w: number, h: number) => {
      setSidePx(Math.max(1, Math.floor(Math.min(w, h))));
    };
    const r0 = row.getBoundingClientRect();
    update(r0.width, r0.height);
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      if (e) {
        const { width, height } = e.contentRect;
        update(width, height);
      }
    });
    ro.observe(row);
    return () => ro.disconnect();
  }, []);

  const halfDiagUser = (0.5 * Math.hypot(NODE_CARD_W, NODE_EST_H) * VIEW) / sidePx;
  const edgeStartMargin = Math.max(28, halfDiagUser);
  const edgeEndMargin = Math.max(28, halfDiagUser + 14);

  return (
    <SlideChrome videoSubtitle={slide.videoSubtitle}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
          opacity: outro,
        }}
      >
        {hasTitle && slide.title ? (
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: slideChrome.ink,
              maxWidth: 1600,
              marginBottom: 8,
              transform: `translateY(${titleY}px)`,
              opacity: titleOp,
              letterSpacing: "-0.02em",
            }}
          >
            {slide.title}
          </div>
        ) : null}

        <div
          ref={graphRowRef}
          style={{
            position: "relative",
            width: "100%",
            minHeight: GRAPH_MIN_H,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: sidePx,
              height: sidePx,
              maxWidth: "100%",
              maxHeight: "100%",
              flexShrink: 0,
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
                filter: "drop-shadow(0 0 12px rgba(53,184,255,0.15))",
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
              const vis = t < 0 ? 0 : spring({ frame: t, fps, config: { damping: 18, stiffness: 140 }, from: 0, to: 1 });
              const pulse = 0.5 + 0.45 * vis;
              return (
                <DirectedArrowEdgeSvg
                  key={`${e.from}-${e.to}-${ei}`}
                  fromX={p0.x}
                  fromY={p0.y}
                  toX={p1.x}
                  toY={p1.y}
                  nodeMarginStart={edgeStartMargin}
                  nodeMarginEnd={edgeEndMargin}
                  drawProgress={vis}
                  trackColor={slideChrome.border}
                  trackWidth={e.lineTrackWidth ?? 14}
                  accentColor={slideChrome.accent}
                  accentWidth={e.lineAccentWidth ?? 4}
                  arrowHeadSize={e.arrowHeadSize ?? 12}
                  showTrack={e.showLineTrack !== false}
                  trackOpacity={0.35 + 0.5 * pulse}
                  accentOpacity={0.4 + 0.55 * pulse}
                />
              );
            })}
            </svg>

          {nodes.map((n, i) => {
            const t0 = nodeStartFrame(i);
            const t = frame - t0;
            const o = t < 0
              ? 0
              : spring({
                  frame: t,
                  fps,
                  config: { damping: 12, mass: 0.55, stiffness: 120 },
                  from: 0,
                  to: 1,
                });
            const enterScale = t < 0
              ? 0.2
              : spring({
                  frame: t,
                  fps,
                  config: { damping: 9, mass: 0.4, stiffness: 180 },
                  from: 0.2,
                  to: 1,
                });
            const visId = nodeVisualId(n);
            const wobble = 0;
            return (
              <div
                key={n.id}
                style={{
                  position: "absolute",
                  left: `${n.x * 100}%`,
                  top: `${n.y * 100}%`,
                  transform: `translate(-50%, -50%) scale(${enterScale}) rotate(${wobble}deg)`,
                  opacity: t < 0 ? 0 : o,
                  width: NODE_CARD_W,
                  minHeight: NODE_CARD_W * 0.95,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  background: "linear-gradient(165deg, rgba(22,26,36,0.97) 0%, rgba(10,12,18,0.95) 100%)",
                  border: `2px solid ${slideChrome.border}`,
                  borderRadius: 24,
                  padding: 18,
                  boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(53,184,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
              >
                <div
                  style={{
                    width: ICON_BOX,
                    height: ICON_BOX,
                    borderRadius: 20,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "radial-gradient(circle at 30% 25%, rgba(53,184,255,0.12), rgba(20,24,32,0.95))",
                    boxShadow: "inset 0 0 40px rgba(0,0,0,0.35)",
                  }}
                >
                  {n.imageUrl ? (
                    <Img
                      src={n.imageUrl}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : visId !== "none" ? (
                    <SemanticIconById id={visId} size={ICON_SIZE} />
                  ) : null}
                </div>
                {n.shortLabel ? (
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: slideChrome.ink,
                      textAlign: "center",
                      lineHeight: 1.25,
                      textShadow: "0 1px 12px rgba(0,0,0,0.6)",
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
            const startF = edgeStartFrame(e) + 8;
            const t = frame - startF;
            const pop = t < 0 ? 0 : spring({ frame: t, fps, config: { damping: 10, stiffness: 200 }, from: 0, to: 1 });
            const o = t < 0 ? 0 : interpolate(t, [0, 10], [0, 1], { extrapolateRight: "clamp" });
            const mx = ((p0.x + p1.x) / 2 / 1000) * 100;
            const my = ((p0.y + p1.y) / 2 / 1000) * 100;
            return o > 0.02 ? (
              <div
                key={`lbl-${e.from}-${e.to}-${ei}`}
                style={{
                  position: "absolute",
                  left: `${mx}%`,
                  top: `${my}%`,
                  transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * pop})`,
                  fontSize: 21,
                  fontWeight: 600,
                  color: slideChrome.accent,
                  background: "rgba(4,5,8,0.92)",
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: `1px solid rgba(53,184,255,0.45)`,
                  opacity: o * pop,
                  maxWidth: 280,
                  textAlign: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                }}
              >
                {e.label}
              </div>
            ) : null;
          })}
          </div>
        </div>
      </div>
    </SlideChrome>
  );
};
