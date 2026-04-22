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
}> = ({ children }) => {
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
          boxSizing: "border-box",
        }}
      >
        {children}
      </AbsoluteFill>
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
