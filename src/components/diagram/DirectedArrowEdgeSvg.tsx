import React, { useId } from "react";
import { shortenSegment } from "../../lib/diagram/shortenSegment";

const DEFAULT_ARROW_TIP = 11;

type Common = {
  /** 0–1: how much of the segment is revealed (drives stroke-dash). */
  drawProgress: number;
  trackColor: string;
  trackWidth: number;
  accentColor: string;
  accentWidth: number;
  /**
   * Arrowhead length in the **same** user units as `viewBox` / `x1`…`y2`
   * (e.g. if coordinates use 0–1000, this is 0–1000 space).
   */
  arrowHeadSize?: number;
  /** `false` to draw a single main stroke (same as accent), no under-glow line. */
  showTrack?: boolean;
  /**
   * Reuse a `<marker>` that already lives in the parent `<svg>`’s `<defs>`.
   * If omitted, this component inlines a unique `<defs>…</defs>` (safe for one-off use).
   */
  markerId?: string;
  /** Fills the arrow; defaults to `accentColor`. */
  markerFill?: string;
  trackOpacity?: number;
  accentOpacity?: number;
};

type CentersGeometry = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  /**
   * Shorten the segment from each end along the line (same user units as coordinates).
   * Omitted = `0` (line runs center-to-center or use `segment` for full control).
   */
  nodeMarginStart?: number;
  nodeMarginEnd?: number;
  segment?: never;
};

type SegmentGeometry = {
  /** Use this segment exactly (no `shortenSegment`); arrowhead at `(x2, y2)`. */
  segment: { x1: number; y1: number; x2: number; y2: number };
  fromX?: never;
  fromY?: never;
  toX?: never;
  toY?: never;
  nodeMarginStart?: never;
  nodeMarginEnd?: never;
};

export type DirectedArrowEdgeSvgProps = Common & (CentersGeometry | SegmentGeometry);

function segmentLength(x0: number, y0: number, x1: number, y1: number): number {
  return Math.hypot(x1 - x0, y1 - y0);
}

/**
 * **Directed** edge A→B: optional track (glow) + accent stroke, arrowhead at the **end** point.
 * Either pass `from* / to*` with optional `nodeMargin*`, or pass `segment` for full control of *where* the line runs
 * in user space. Callers from different videos/slides can set start/end in code or via `videoPlan` edge fields.
 */
export const DirectedArrowEdgeSvg: React.FC<DirectedArrowEdgeSvgProps> = (props) => {
  const {
    drawProgress,
    trackColor,
    trackWidth,
    accentColor,
    accentWidth,
    arrowHeadSize = DEFAULT_ARROW_TIP,
    showTrack = true,
    markerId: markerIdProp,
    markerFill: markerFillOpt,
    trackOpacity = 0.38,
    accentOpacity = 0.92,
  } = props;

  const autoId = useId().replace(/:/g, "_");
  const fill = markerFillOpt ?? accentColor;
  const useExternalMarker = Boolean(markerIdProp);
  const mid = markerIdProp ?? `remoDirArrowMarker_${autoId}`;

  const { s, L } = (() => {
    if ("segment" in props && props.segment) {
      const { x1, y1, x2, y2 } = props.segment;
      const len = segmentLength(x1, y1, x2, y2);
      return { s: { x0: x1, y0: y1, x1: x2, y1: y2, length: len } as const, L: len };
    }
    const { fromX, fromY, toX, toY, nodeMarginStart = 0, nodeMarginEnd = 0 } = props as CentersGeometry;
    const s0 = shortenSegment(fromX, fromY, toX, toY, nodeMarginStart, nodeMarginEnd);
    return { s: s0, L: s0.length } as const;
  })();

  if (L < 0.5) {
    return null;
  }
  const p = Math.max(0, Math.min(1, drawProgress));
  const draw = p * L;

  const line = (
    <>
      {showTrack ? (
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
      ) : null}
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
        markerEnd={`url(#${mid})`}
        opacity={accentOpacity}
      />
    </>
  );

  if (useExternalMarker) {
    return <g>{line}</g>;
  }
  return (
    <g>
      <defs>
        <DiagramArrowheadMarker id={mid} fill={fill} size={arrowHeadSize} />
      </defs>
      {line}
    </g>
  );
};

const BASE = 11;

/**
 * `size` = tip-to-base width in the same user units as the surrounding SVG
 * (matches `userSpaceOnUse` marker coordinates).
 */
export const DiagramArrowheadMarker: React.FC<{
  id: string;
  fill: string;
  size?: number;
}> = ({ id, fill, size = DEFAULT_ARROW_TIP }) => {
  const k = size / BASE;
  const w = 11 * k;
  const h = 8 * k;
  const refX = 11 * k;
  const refY = 4 * k;
  return (
    <marker
      id={id}
      markerUnits="userSpaceOnUse"
      refX={refX}
      refY={refY}
      markerWidth={w}
      markerHeight={h}
      orient="auto"
    >
      <path d={`M0 0 L ${11 * k} ${4 * k} L 0 ${8 * k} Z`} fill={fill} />
    </marker>
  );
};
