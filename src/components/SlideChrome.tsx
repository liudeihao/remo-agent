import { AbsoluteFill } from "remotion";
import React from "react";

const palette = {
  bg: "#060607",
  ink: "#e8eaef",
  muted: "#9aa3b2",
  accent: "#35b8ff",
  border: "rgba(148, 163, 184, 0.25)",
};

export const slideChrome: typeof palette = palette;

export const SlideChrome: React.FC<{
  children: React.ReactNode;
  /** Bottom-anchored 字幕 (shared by all kinds); leave empty to hide. */
  videoSubtitle?: string;
}> = ({ children, videoSubtitle }) => {
  const hasCap = Boolean(videoSubtitle?.trim());
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.bg,
        color: palette.ink,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <AbsoluteFill
        style={{
          padding: 96,
          paddingBottom: hasCap ? 132 : 96,
          boxSizing: "border-box",
        }}
      >
        {children}
      </AbsoluteFill>
      {hasCap ? (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingLeft: 96,
            paddingRight: 96,
            paddingBottom: 40,
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          <div
            style={{
              maxWidth: 1500,
              width: "100%",
              textAlign: "center",
              fontSize: 32,
              lineHeight: 1.42,
              fontWeight: 500,
              color: palette.ink,
              textShadow: "0 1px 3px #000, 0 2px 18px #000, 0 0 1px #000",
              background: "rgba(3,4,6,0.78)",
              border: `1px solid ${palette.border}`,
              borderRadius: 12,
              padding: "12px 20px 14px",
              boxSizing: "border-box",
            }}
          >
            {videoSubtitle?.trim()}
          </div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          border: `1px solid ${palette.border}`,
          margin: 36,
          borderRadius: 18,
        }}
      />
    </AbsoluteFill>
  );
};
