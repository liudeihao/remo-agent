import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { getEffectiveKinetic } from "../lib/kineticArc";
import { renderLineWithHighlights } from "../lib/highlight";
import { pickLineCardIconId, renderLineWithSemanticVisuals } from "../lib/semanticLine";
import { SemanticIconArrows, SemanticIconById } from "../lib/semanticIcons";
import { slideChrome, SlideChrome } from "./SlideChrome";
import type { KineticTextSlide, KineticTextLineAnim } from "../types/videoPlan";

const markStyle: React.CSSProperties = {
  background: "rgba(53, 184, 255, 0.2)",
  color: slideChrome.accent,
  padding: "0 6px 2px",
  borderRadius: 6,
  display: "inline-block",
};

const liBase: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: "0 0 0 8px",
  maxWidth: 1500,
  color: slideChrome.ink,
};

const wordStyle: React.CSSProperties = {
  display: "inline-block",
  marginRight: 10,
  marginBottom: 6,
  fontSize: 34,
  lineHeight: 1.4,
};

function getStagger(
  lineAnimation: KineticTextLineAnim,
  stagger: number,
): number {
  if (lineAnimation === "wordStagger") {
    return Math.max(2, Math.round(stagger * 0.4));
  }
  return stagger;
}

function lineEl(
  line: string,
  highlights: string[] | undefined,
  showIcons: boolean,
): React.ReactNode {
  return renderLineWithSemanticVisuals(line, highlights, markStyle, showIcons);
}

function LineStaggerBounce({
  line,
  highlights,
  lineIndex,
  staggerFrames,
  contentStart,
  showIcons,
}: {
  line: string;
  highlights: string[] | undefined;
  lineIndex: number;
  staggerFrames: number;
  contentStart: number;
  showIcons: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = contentStart + lineIndex * staggerFrames;
  const t = frame - t0;
  const opacity = interpolate(t, [0, 5], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y =
    t < 0
      ? 50
      : spring({
          frame: t,
          fps,
          config: { damping: 16, mass: 0.45, stiffness: 90 },
          from: 48,
          to: 0,
        });
  return (
    <li
      style={{
        ...liBase,
        opacity: t < -1 ? 0 : opacity,
        transform: `translateY(${t < -1 ? 48 : y}px)`,
        fontSize: 34,
        lineHeight: 1.35,
      }}
    >
      {lineEl(line, highlights, showIcons)}
    </li>
  );
}

function LineStaggerFade({
  line,
  highlights,
  lineIndex,
  staggerFrames,
  contentStart,
  showIcons,
}: {
  line: string;
  highlights: string[] | undefined;
  lineIndex: number;
  staggerFrames: number;
  contentStart: number;
  showIcons: boolean;
}) {
  const frame = useCurrentFrame();
  const t0 = contentStart + lineIndex * staggerFrames;
  const t = frame - t0;
  const opacity = interpolate(t, [0, 10], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(t, [0, 8], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <li
      style={{
        ...liBase,
        opacity: t < -0.5 ? 0 : opacity,
        fontSize: 34,
        lineHeight: 1.35,
        filter: t < 0 ? "blur(8px)" : `blur(${blur}px)`,
      }}
    >
      {lineEl(line, highlights, showIcons)}
    </li>
  );
}

function LineWordStagger({
  line,
  highlights,
  lineIndex,
  staggerFrames,
  contentStart,
  showIcons,
}: {
  line: string;
  highlights: string[] | undefined;
  lineIndex: number;
  staggerFrames: number;
  contentStart: number;
  showIcons: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tokens = /\s/.test(line) ? line.trim().split(/\s+/) : [...line];
  return (
    <li style={{ ...liBase, fontSize: 34, lineHeight: 1.5 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        {tokens.map((token, w) => {
          const t0 = contentStart + lineIndex * 4 + w * staggerFrames;
          const t = frame - t0;
          const opacity = interpolate(t, [0, 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y =
            t < 0
              ? 20
              : spring({
                  frame: t,
                  fps,
                  config: { damping: 18, mass: 0.4 },
                  from: 18,
                  to: 0,
                });
            return (
            <span
              key={w}
              style={{
                ...wordStyle,
                opacity: t < 0 ? 0 : opacity,
                transform: `translateY(${t < 0 ? 18 : y}px)`,
                marginRight: /\s/.test(line) ? 6 : 0,
              }}
            >
              {lineEl(token, highlights, showIcons)}
            </span>
          );
        })}
      </div>
    </li>
  );
}

function BlockCollide({
  lines,
  highlights,
  contentStart,
  pairIndex,
  showIcons,
  dialecticIcons,
}: {
  lines: [string, string?];
  highlights: string[] | undefined;
  contentStart: number;
  pairIndex: number;
  showIcons: boolean;
  /** When set (e.g. dialectic), show column icons in collide layout */
  dialecticIcons?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = contentStart + pairIndex * 55;
  const f = frame - start;
  const a = lines[0];
  const b = lines[1];
  const tMeet = 16;
  const x0 = interpolate(f, [0, tMeet], [-480, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x1 = b
    ? interpolate(f, [0, tMeet], [480, 0], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const shake =
    f >= tMeet
      ? Math.sin((f - tMeet) * 0.55) * 6 * Math.exp(-(f - tMeet) * 0.12)
      : 0;
  const bump = spring({
    frame: Math.max(0, f - tMeet),
    fps,
    config: { damping: 8, mass: 0.6, stiffness: 200 },
    from: 1,
    to: 1.05,
  });
  const scale = f < tMeet ? 1 : f < tMeet + 10 ? bump : 1;
  if (!a) {
    return null;
  }
  if (!b) {
    return (
      <li style={{ ...liBase, fontSize: 34, lineHeight: 1.35, transform: `translateX(${x0 + shake}px) scale(${scale})` }}>
        {lineEl(a, highlights, showIcons)}
      </li>
    );
  }
  const colIcon = (line: string) => (
    dialecticIcons && showIcons && (
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <SemanticIconById id={pickLineCardIconId(line, highlights)} size={36} />
      </div>
    )
  );
  return (
    <li style={{ listStyle: "none", margin: 0, padding: 0 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          transform: `translateX(${shake}px)`,
        }}
      >
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.35,
            maxWidth: 700,
            color: slideChrome.ink,
            transform: `translateX(${x0}px) scale(${scale})`,
            textAlign: "right" as const,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {colIcon(a)}
          {dialecticIcons
            ? renderLineWithHighlights(a, highlights, markStyle)
            : lineEl(a, highlights, showIcons)}
        </div>
        <div
          style={{
            width: 3,
            height: 36,
            background: `linear-gradient(${slideChrome.border}, ${slideChrome.accent})`,
            borderRadius: 2,
            opacity: f > 4 ? 0.35 : 0,
            flexShrink: 0,
            alignSelf: "center",
          }}
        />
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.35,
            maxWidth: 700,
            color: slideChrome.ink,
            transform: `translateX(${x1}px) scale(${scale})`,
            textAlign: "left" as const,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {colIcon(b)}
          {dialecticIcons
            ? renderLineWithHighlights(b, highlights, markStyle)
            : lineEl(b, highlights, showIcons)}
        </div>
      </div>
    </li>
  );
}

function BlockDriftTilt({
  lines,
  highlights,
  staggerFrames,
  contentStart,
  showIcons,
}: {
  lines: string[];
  highlights: string[] | undefined;
  staggerFrames: number;
  contentStart: number;
  showIcons: boolean;
}) {
  const frame = useCurrentFrame();
  return (
    <ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 20 }}>
      {lines.map((line, i) => {
        const t0 = contentStart + i * staggerFrames;
        const t = frame - t0;
        const opacity = interpolate(t, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rot = 0.8 * Math.sin((frame + i * 7) * 0.11) + 0.2 * Math.sin((frame * 0.9 + i * 3) * 0.15);
        const skew = Math.sin((frame + i * 2) * 0.08) * 0.4;
        return (
          <li
            key={i}
            style={{
              ...liBase,
              fontSize: 33,
              lineHeight: 1.38,
              opacity: t < 0 ? 0 : opacity,
              transform: `rotate(${rot}deg) skewX(${skew}deg)`,
            }}
          >
            {lineEl(line, highlights, showIcons)}
          </li>
        );
      })}
    </ul>
  );
}

function BlockFloatIn({
  lines,
  highlights,
  contentStart,
  showIcons,
}: {
  lines: string[];
  highlights: string[] | undefined;
  contentStart: number;
  showIcons: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - contentStart;
  const opacity = interpolate(t, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const y = spring({
    frame: t,
    fps,
    config: { damping: 20, mass: 0.5 },
    from: 32,
    to: 0,
  });
  return (
    <ul
      style={{
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        opacity: t < 0 ? 0 : opacity,
        transform: `translateY(${t < 0 ? 32 : y}px)`,
      }}
    >
      {lines.map((line, i) => (
        <li key={i} style={{ ...liBase, fontSize: 34, lineHeight: 1.35 }}>
          {lineEl(line, highlights, showIcons)}
        </li>
      ))}
    </ul>
  );
}

function MechanismChainBlock({
  lines,
  highlights,
  contentStart,
}: {
  lines: [string, string, string];
  highlights: string[] | undefined;
  contentStart: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "stretch",
        justifyContent: "center",
        gap: 10,
        width: "100%",
      }}
    >
      {lines.map((line, i) => {
        const t0 = contentStart + i * 20;
        const t = frame - t0;
        const opacity = interpolate(t, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = spring({
          frame: Math.max(0, t),
          fps,
          config: { damping: 16, mass: 0.45, stiffness: 120 },
          from: 48,
          to: 0,
        });
        const id = pickLineCardIconId(line, highlights);
        return (
          <React.Fragment key={i}>
            {i > 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4px",
                  opacity: interpolate(
                    t,
                    [4, 14],
                    [0, 0.7],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  ),
                }}
                aria-hidden
              >
                <SemanticIconArrows />
              </div>
            ) : null}
            <div
              style={{
                flex: "1 1 280px",
                maxWidth: 420,
                minHeight: 120,
                background: "rgba(12, 14, 20, 0.78)",
                border: `1px solid ${slideChrome.border}`,
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                opacity: t < 0 ? 0 : opacity,
                transform: `translateX(${t < 0 ? 50 : x}px)`,
                boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
              }}
            >
              <SemanticIconById id={id} size={40} />
              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: slideChrome.ink,
                }}
              >
                {renderLineWithHighlights(line, highlights, markStyle)}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TitleBlock({ title }: { title: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame;
  const tEnd = 14;
  const opacity = interpolate(t, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const y = spring({
    frame: t,
    fps,
    config: { damping: 14, mass: 0.55, stiffness: 100 },
    from: 70,
    to: 0,
  });
  if (t > tEnd) {
    // slight idle pulse on title
    const pulse = 1 + 0.01 * Math.sin((frame - tEnd) * 0.08);
    return (
      <div
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: slideChrome.ink,
          maxWidth: 1500,
          marginBottom: 24,
          transform: `translateY(0) scale(${pulse})`,
        }}
      >
        {title}
      </div>
    );
  }
  return (
    <div
      style={{
        fontSize: 52,
        fontWeight: 700,
        color: slideChrome.ink,
        maxWidth: 1500,
        marginBottom: 24,
        opacity: t < 0 ? 0 : opacity,
        transform: `translateY(${t < 0 ? 70 : y}px)`,
      }}
    >
      {title}
    </div>
  );
}

export const KineticTextSlideView: React.FC<{ slide: KineticTextSlide }> = ({
  slide,
}) => {
  const frame = useCurrentFrame();
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
  const lines = slide.lines;
  const eff = getEffectiveKinetic(
    slide.lineAnimation,
    slide.contentArc,
    lines.length,
  );
  const baseStagger = slide.staggerFrames ?? eff.staggerFrames;
  const stagger = getStagger(eff.lineAnimation, baseStagger);
  const hasTitle = Boolean(slide.title?.trim());
  const contentStart = hasTitle ? 20 : 0;
  const anim = eff.lineAnimation;
  const hl = slide.highlights;
  const showIcons = slide.showSemanticIcons !== false;
  const isDialectic = slide.contentArc === "dialectic" && anim === "collide";
  const useMechanismChain = eff.useMechanismChain;
  const mechanismTriple =
    useMechanismChain && lines.length === 3
      ? ([lines[0], lines[1], lines[2]] as [string, string, string])
      : null;

  return (
    <SlideChrome videoSubtitle={slide.videoSubtitle}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 12,
          opacity: outro,
        }}
      >
        {hasTitle && slide.title ? <TitleBlock title={slide.title} /> : null}
        {mechanismTriple ? (
          <MechanismChainBlock
            lines={mechanismTriple}
            highlights={hl}
            contentStart={contentStart}
          />
        ) : null}
        {!mechanismTriple && anim === "staggerBounce" && (
          <ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            {lines.map((line, i) => (
              <LineStaggerBounce
                key={i}
                line={line}
                highlights={hl}
                lineIndex={i}
                staggerFrames={stagger}
                contentStart={contentStart}
                showIcons={showIcons}
              />
            ))}
          </ul>
        )}
        {!mechanismTriple && anim === "staggerFade" && (
          <ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            {lines.map((line, i) => (
              <LineStaggerFade
                key={i}
                line={line}
                highlights={hl}
                lineIndex={i}
                staggerFrames={stagger}
                contentStart={contentStart}
                showIcons={showIcons}
              />
            ))}
          </ul>
        )}
        {!mechanismTriple && anim === "wordStagger" && (
          <ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {lines.map((line, i) => (
              <LineWordStagger
                key={i}
                line={line}
                highlights={hl}
                lineIndex={i}
                staggerFrames={stagger}
                contentStart={contentStart}
                showIcons={showIcons}
              />
            ))}
          </ul>
        )}
        {!mechanismTriple && anim === "collide" && (
          <ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 32 }}>
            {Array.from({ length: Math.ceil(lines.length / 2) }).map((_, pair) => {
              const a = lines[pair * 2];
              const b = lines[pair * 2 + 1];
              return (
                <BlockCollide
                  key={pair}
                  lines={[a, b]}
                  highlights={hl}
                  contentStart={contentStart}
                  pairIndex={pair}
                  showIcons={showIcons}
                  dialecticIcons={isDialectic}
                />
              );
            })}
          </ul>
        )}
        {!mechanismTriple && anim === "driftTilt" && (
          <BlockDriftTilt
            lines={lines}
            highlights={hl}
            staggerFrames={stagger}
            contentStart={contentStart}
            showIcons={showIcons}
          />
        )}
        {!mechanismTriple && anim === "floatIn" && (
          <BlockFloatIn
            lines={lines}
            highlights={hl}
            contentStart={contentStart}
            showIcons={showIcons}
          />
        )}
      </div>
    </SlideChrome>
  );
};
