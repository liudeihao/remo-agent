import React from "react";
import { renderLineWithHighlights } from "./highlight";
import { keywordToSemanticIconId, SemanticIconById, type SemanticIconName } from "./semanticIcons";

/**
 * 在高亮前插入语义小图标；无高亮或不启用时回退为纯文本/纯高亮。
 */
export function renderLineWithSemanticVisuals(
  line: string,
  keywords: string[] | undefined,
  markStyle: React.CSSProperties,
  showIcons: boolean,
): React.ReactNode {
  if (!showIcons) {
    return renderLineWithHighlights(line, keywords, markStyle);
  }
  if (!keywords?.length) {
    return line;
  }
  const sorted = [...keywords].filter(Boolean).sort((a, b) => b.length - a.length);
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    let bestIdx = -1;
    let bestKw = "";
    for (const kw of sorted) {
      const idx = remaining.indexOf(kw);
      if (idx >= 0 && (bestIdx < 0 || idx < bestIdx)) {
        bestIdx = idx;
        bestKw = kw;
      }
    }
    if (bestIdx < 0) {
      parts.push(remaining);
      break;
    }
    if (bestIdx > 0) {
      parts.push(remaining.slice(0, bestIdx));
    }
    const iid = keywordToSemanticIconId(bestKw);
    parts.push(
      <span
        key={key++}
        style={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          verticalAlign: "middle",
        }}
      >
        {iid !== "none" ? <SemanticIconById id={iid} size={26} /> : null}
        <mark style={markStyle}>{bestKw}</mark>
      </span>,
    );
    remaining = remaining.slice(bestIdx + bestKw.length);
  }
  return <>{parts}</>;
}

export function pickLineCardIconId(line: string, highlights: string[] | undefined): SemanticIconName {
  if (!highlights?.length) {
    return "paper";
  }
  for (const h of highlights) {
    if (line.includes(h)) {
      const id = keywordToSemanticIconId(h);
      if (id !== "none") {
        return id;
      }
    }
  }
  return "paper";
}
