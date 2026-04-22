import React from "react";

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Wrap first occurrences of keywords in <mark> spans (simple, deterministic).
 */
export function renderLineWithHighlights(
  line: string,
  keywords: string[] | undefined,
  markStyle: React.CSSProperties,
): React.ReactNode {
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
    parts.push(
      <mark key={key++} style={markStyle}>
        {bestKw}
      </mark>,
    );
    remaining = remaining.slice(bestIdx + bestKw.length);
  }

  return <>{parts}</>;
}

export function highlightPatternsInCode(
  code: string,
  patterns: string[] | undefined,
): React.ReactNode[] {
  const safe = patterns?.map((p) => p.trim()).filter(Boolean) ?? [];
  if (!safe.length) {
    return [<span key="all">{code}</span>];
  }

  const r = new RegExp(`(${safe.map(escapeRegExp).join("|")})`, "g");
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = r.exec(code)) !== null) {
    if (m.index > lastIndex) {
      nodes.push(
        <span key={`t-${k++}`}>{code.slice(lastIndex, m.index)}</span>,
      );
    }
    nodes.push(
      <span key={`h-${k++}`} style={{ color: "#fbbf24" }}>
        {m[0]}
      </span>,
    );
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < code.length) {
    nodes.push(<span key={`t-${k++}`}>{code.slice(lastIndex)}</span>);
  }
  return nodes.length ? nodes : [<span key="all">{code}</span>];
}
