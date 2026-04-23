import React from "react";

const iconAccent = "#5bc0ff";
const iconMuted = "#7c8aa0";

const stroke = "currentColor";
/** Base SVG viewBox size; rendered size comes from `SemanticIconById` `size` */
const sz = 22;

/**
 * 内联 SVG，与文案语义绑定（论文、经费、系所等），不依赖外网图床。
 */
export const SemanticIconPaper: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: iconAccent, flexShrink: 0 }}
    aria-hidden
  >
    <path
      d="M7 3h7l5 5v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      stroke={stroke}
      strokeWidth="1.6"
      fill="none"
    />
    <path d="M14 3v4h4" stroke={stroke} strokeWidth="1.4" fill="none" />
    <path d="M8.5 12h6M8.5 15.5h6" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const SemanticIconFunding: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: iconAccent, flexShrink: 0 }}
    aria-hidden
  >
    <circle cx="9" cy="14" r="4" stroke={stroke} strokeWidth="1.4" fill="none" />
    <circle cx="16" cy="9" r="2.5" stroke={stroke} strokeWidth="1.4" fill="none" />
    <path
      d="M5 6c2-1 3.5-1.5 5-1.5M5 6v3M10 4.5V7"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const SemanticIconBuilding: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: iconAccent, flexShrink: 0 }}
    aria-hidden
  >
    <path
      d="M5 20V9l4-2 4 2v11M4 20h16"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M9 20v-4h2v4M7 12h.01M9 12h.01M7 16h.01" stroke={stroke} strokeWidth="1.2" />
  </svg>
);

/** 生产资料 / 机制 — 简化为齿轮+底座 */
export const SemanticIconCogs: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: iconAccent, flexShrink: 0 }}
    aria-hidden
  >
    <circle cx="12" cy="9" r="3.5" stroke={stroke} strokeWidth="1.3" fill="none" />
    {[-60, 0, 60, 120, 180, 240].map((a, i) => (
      <line
        key={i}
        x1="12"
        y1="4"
        x2="12"
        y2="6.2"
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinecap="round"
        transform={`rotate(${a} 12 9)`}
      />
    ))}
    <path d="M5 20h14v-2H5v2z" stroke={stroke} strokeWidth="1.1" fill="none" />
  </svg>
);

export const SemanticIconPeople: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: iconAccent, flexShrink: 0 }}
    aria-hidden
  >
    <circle cx="8" cy="8" r="2.2" stroke={stroke} strokeWidth="1.2" fill="none" />
    <path d="M4 20c.5-3.2 2.3-4.2 4-4.2s3.5 1 4 4.2" stroke={stroke} strokeWidth="1.2" fill="none" />
    <circle cx="16" cy="7" r="1.7" stroke={stroke} strokeWidth="1.1" fill="none" />
    <path
      d="M19 20c0-2.1-1.3-2.7-2.2-2.7-.3 0-.5.1-.7.1"
      stroke={stroke}
      strokeWidth="1.1"
      fill="none"
    />
  </svg>
);

export const SemanticIconScales: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: iconAccent, flexShrink: 0 }}
    aria-hidden
  >
    <path
      d="M12 3v2M5 6h14M5 6l-1.5 5h3L5 6zm14 0l-1.5 5h3L19 6zM8 6v14M8 6h8v14"
      stroke={stroke}
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

export const SemanticIconLight: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: iconAccent, flexShrink: 0 }}
    aria-hidden
  >
    <path
      d="M9 18h6M10 20h4M12 2v1.2M4.2 7.6l1 .6M2 12h1.2M4.2 16.4l1-.5M20.8 7.6l-1 .6M22 12h-1.2M20.8 16.4l-1-.5"
      stroke={stroke}
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    <path
      d="M8.2 10.2a3.8 3.8 0 0 0 7.6 0c0-2.1-1.2-2.4-1.2-2.4h-5.2s-1.2.3-1.2 2.4z"
      stroke={stroke}
      strokeWidth="1.2"
      fill="none"
    />
  </svg>
);

export const SemanticIconBook: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: iconAccent, flexShrink: 0 }}
    aria-hidden
  >
    <path
      d="M5 4.5a2.5 2.5 0 0 1 2.5-2.5H17a2.5 2.5 0 0 1 2.5 2.5V19a1 1 0 0 1-1 1H8a1 1 0 0 0-1-1H5.5A1.5 1.5 0 0 0 4 19.5V4.5z"
      stroke={stroke}
      strokeWidth="1.2"
    />
  </svg>
);

export const SemanticIconArrows: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={28}
    height={sz}
    viewBox="0 0 28 24"
    fill="none"
    className={className}
    style={{ color: iconMuted, flexShrink: 0 }}
    aria-hidden
  >
    <path
      d="M2 12h20M20 7l4 5-4 5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type SemanticIconName =
  | "paper"
  | "funding"
  | "building"
  | "cogs"
  | "people"
  | "scales"
  | "light"
  | "book"
  | "none";

const idToComponent: Record<Exclude<SemanticIconName, "none">, React.FC<{ className?: string }>> = {
  paper: SemanticIconPaper,
  funding: SemanticIconFunding,
  building: SemanticIconBuilding,
  cogs: SemanticIconCogs,
  people: SemanticIconPeople,
  scales: SemanticIconScales,
  light: SemanticIconLight,
  book: SemanticIconBook,
};

/** 按关键词内容匹配图标（用于高亮词与短标签） */
export function keywordToSemanticIconId(keyword: string): SemanticIconName {
  const k = keyword.trim();
  if (!k) {
    return "none";
  }
  const rules: { match: (s: string) => boolean; id: SemanticIconName }[] = [
    { match: (s) => s.includes("生产资料") || s.includes("生产资"), id: "cogs" },
    { match: (s) => s.includes("问题意识"), id: "light" },
    { match: (s) => s.includes("论文") || s.includes("发表"), id: "paper" },
    {
      match: (s) =>
        s.includes("经费") || s.includes("资金") || s.includes("账目") || s.includes("项目") || s.includes("审计"),
      id: "funding",
    },
    { match: (s) => s.includes("本系") || s.includes("系里") || s.includes("院系") || s.includes("系所"), id: "building" },
    { match: (s) => s.includes("学生") || s.includes("师生"), id: "people" },
    { match: (s) => s.includes("结构") || s.includes("制度") || s.includes("组织") || s.includes("指标"), id: "scales" },
    { match: (s) => s.includes("《") && s.includes("》"), id: "book" },
  ];
  for (const r of rules) {
    if (r.match(k)) {
      return r.id;
    }
  }
  return "none";
}

export function SemanticIconById({ id, size = 24 }: { id: SemanticIconName; size?: number }) {
  if (id === "none") {
    return null;
  }
  const C = idToComponent[id];
  const scale = size / sz;
  return (
    <span
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          display: "inline-block",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <C />
      </span>
    </span>
  );
}
