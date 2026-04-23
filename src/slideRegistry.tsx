import React from "react";
import { BulletsSlideView } from "./components/BulletsSlideView";
import { CodeSlideView } from "./components/CodeSlideView";
import { CoverSlideView } from "./components/CoverSlideView";
import { MediaSlideView } from "./components/MediaSlideView";
import { KineticTextSlideView } from "./components/KineticTextSlideView";
import { ExplainerGraphSlideView } from "./components/ExplainerGraphSlideView";
import { TypewriterTextSlideView } from "./components/TypewriterTextSlideView";
import type { PlanSlide, SlideKind } from "./types/videoPlan";

function assertNever(x: never): never {
  throw new Error(`Unhandled slide kind: ${String(x)}`);
}

/**
 * Machine-readable index of built-in slide kinds. When adding a new kind, update
 * the PlanSlide union, this catalog, and renderSlideContent.
 */
export const SLIDE_CATALOG: ReadonlyArray<{
  kind: SlideKind;
  label: string;
  description: string;
}> = [
  {
    kind: "cover",
    label: "Cover",
    description: "Title, optional subtitle, period badge, and optional brand footer",
  },
  {
    kind: "bullets",
    label: "Bullets",
    description: "Headline with bullet lines and optional substring highlights",
  },
  {
    kind: "media",
    label: "Media",
    description: "Headline, full-bleed image from URL, optional caption",
  },
  {
    kind: "code",
    label: "Code",
    description: "Headline, language badge, monospace block with token highlights",
  },
  {
    kind: "kineticText",
    label: "Kinetic / explainer text (legacy lines)",
    description:
      "Line-by-line motion; prefer explainerGraph + typewriterText for 科普。组会/演讲式信息墙可用此项。",
  },
  {
    kind: "explainerGraph",
    label: "Explainer graph",
    description:
      "Icons or images as nodes, edges as relations—visual-first, content-driven, not a script wall",
  },
  {
    kind: "typewriterText",
    label: "Typewriter (abstract copy)",
    description:
      "One block revealed by char or by word: for abstract points where graphics do not help",
  },
] as const;

/**
 * Renders a single slide using the built-in view components. Compositions should
 * wrap this in Sequence; keys belong on the Sequence, not here.
 */
export function renderSlideContent(slide: PlanSlide): React.ReactNode {
  switch (slide.kind) {
    case "cover":
      return <CoverSlideView slide={slide} />;
    case "bullets":
      return <BulletsSlideView slide={slide} />;
    case "media":
      return <MediaSlideView slide={slide} />;
    case "code":
      return <CodeSlideView slide={slide} />;
    case "kineticText":
      return <KineticTextSlideView slide={slide} />;
    case "explainerGraph":
      return <ExplainerGraphSlideView slide={slide} />;
    case "typewriterText":
      return <TypewriterTextSlideView slide={slide} />;
    default:
      return assertNever(slide);
  }
}
