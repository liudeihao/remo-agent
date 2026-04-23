import React from "react";
import { shortenSegment } from "../../lib/diagram/shortenSegment";

type Props = {
  /** Center coordinates in SVG user space (e.g. viewBox 0–1000). */
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  nodeMarginStart?: number;
  nodeMarginEnd?: number;
  /** 0–1: how much of the edge is revealed (driving stroke-dash). */
  drawProgress: number;
  trackColor: string;
  trackWidth: number;
  accentColor: string;
  accentWidth: number;
  /** `id` of a `<marker>` in the same `<svg>`’s `<defs>`. */
  accentMarkerId: string;
  trackOpacity?: number;
  accentOpacity?: number;
};

/**
 * Single reusable primitive: **directed** edge A→B (track + accent + arrowhead at **to**).
 * Use anywhere the semantics are “influence/flow in this direction”; not for undirected relations.
 */
export const DirectedArrowEdgeSvg: React.FC<Props> = ({
  fromX,
  fromY,
  toX,
  toY,
  nodeMarginStart = 38,
  nodeMarginEnd = 42,
  drawProgress,
  trackColor,
  trackWidth,
  accentColor,
  accentWidth,
  accentMarkerId,
  trackOpacity = 0.38,
  accentOpacity = 0.92,
}) => {
  const s = shortenSegment(fromX, fromY, toX, toY, nodeMarginStart, nodeMarginEnd);
  const L = s.length;
  if (L < 0.5) {
    return null;
  }
  const p = Math.max(0, Math.min(1, drawProgress));
  const draw = p * L;
  return (
    <g>
      <line
        x1={s.x0}
        y1={s.y0}
        x2={s.x1}
        y2={s.y1}
        stroke={trackColor}
        strokeWidth={trackWidth}
        strokeLinecap="round"
        pathLength={L}
        strokeDasharray={`${L}`}
        strokeDashoffset={L - draw}
        opacity={trackOpacity}
      />
      <line
        x1={s.x0}
        y1={s.y0}
        x2={s.x1}
        y2={s.y1}
        stroke={accentColor}
        strokeWidth={accentWidth}
        strokeLinecap="round"
        pathLength={L}
        strokeDasharray={`${L}`}
        strokeDashoffset={L - draw}
        markerEnd={`url(#${accentMarkerId})`}
        opacity={accentOpacity}
      />
    </g>
  );
};

/** Place once inside the same `<svg>`’s `<defs>`, before edges. */
export const DiagramArrowheadMarker: React.FC<{
  id: string;
  fill: string;
}> = ({ id, fill }) => (
  <marker
    id={id}
    markerUnits="userSpaceOnUse"
    refX={11}
    refY={4}
    markerWidth={11}
    markerHeight={8}
    orient="auto"
  >
    <path d="M0 0 L 11 4 L 0 8 Z" fill={fill} />
  </marker>
);
