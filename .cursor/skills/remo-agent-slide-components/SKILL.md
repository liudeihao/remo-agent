---
name: remo-agent-slide-components
description: Adds or changes Remotion slide UI in remo-agent—new PlanSlide kinds, *SlideView components, and slideRegistry entries. Use when editing src/components/*SlideView.tsx, src/slideRegistry.tsx, or src/types/videoPlan.ts for visual layouts; or when the user asks for a new slide type, kind, or reusable Remotion view.
---

# Slide components and registry (remo-agent)

## How this skill fits the pipeline

| Stage | Skill | Responsibility |
| --- | --- | --- |
| On-screen text / structure as data | `remo-agent-video-plan` | `VideoPlanProps` JSON, valid `kind`s, copy and `ttsText` |
| **Reusable Remotion UI for each `kind`** | **this skill** | Types, `*SlideView` components, `SLIDE_CATALOG`, `renderSlideContent` |
| Timeline → MP4 | `remo-agent-remotion-render` | Studio, `remotion render`, props file |
| Spoken audio (optional) | `remo-agent-narration-tts` | `narrationAudioUrl`, external TTS workflow |

`VideoFromPlan` **does not** list components per slide. It only calls `renderSlideContent` from `src/slideRegistry.tsx`. New visuals **must** go through the registry so JSON-driven videos stay the single path.

## When to use

- Adding a new `kind` (new discriminant on `PlanSlide`).
- Creating or editing a slide view under `src/components/`.
- Registering a component in `src/slideRegistry.tsx`.
- Refactoring shared chrome (e.g. `SlideChrome`, `src/lib/*`).

## Extension checklist (do in order)

1. **`src/types/videoPlan.ts`**
   - Add a new `XxxSlide` type with a **string literal** `kind: "yourKind"`.
   - Add it to the `PlanSlide` union. `SlideKind` will update automatically.

2. **`src/components/YourKindSlideView.tsx`**
   - Export a `React.FC<{ slide: XxxSlide }>` (or equivalent).
   - Reuse `SlideChrome`, `useSlideEntrance` / `src/lib` patterns; match existing slide files for style.

3. **`src/components/index.ts`**
   - Export the new view so discoverability and imports stay consistent.

4. **`src/slideRegistry.tsx`**
   - Append one object to `SLIDE_CATALOG` (`kind`, `label`, `description`).
   - Add a `case "yourKind":` in `renderSlideContent` that returns `<YourKindSlideView slide={slide} />`.
   - The `default` branch uses `assertNever` — if the switch is incomplete, TypeScript will fail.

5. **Validate**
   - Run `npx tsc --noEmit`. Fix errors before claiming done.

6. **JSON / docs**
   - Update or add sample slides in `data/*.json` if useful.
   - The `remo-agent-video-plan` skill is updated by humans/agents so new `kind` and fields are documented for script authors.

## Conventions

- **File name**: `PascalCase` + `SlideView.tsx` (e.g. `MediaSlideView.tsx`).
- **Props**: `{ slide: XxxSlide }` — keep slide data the only prop when possible.
- **No** ad-hoc imports of slide views from `src/compositions/VideoFromPlan.tsx` for production slide types. The composition stays generic.

## Do not

- Add a new `kind` in JSON or in a component without updating **all** of: `videoPlan.ts`, the new `*SlideView`, and `slideRegistry.tsx`.
- Register a view in the registry but omit it from `SLIDE_CATALOG` (the catalog is the human/agent index of what exists).
- Put API keys, network TTS, or non-visual side effects inside slide components; keep views presentational.
- Create a second parallel routing path (e.g. branching inside `VideoFromPlan` on `kind` with duplicate JSX). Use **only** `renderSlideContent`.

## Related files

- `src/compositions/VideoFromPlan.tsx` — layout of sequences + optional `Audio` only; no per-kind JSX.
- `src/Root.tsx` — registers `VideoFromPlan` composition; rarely needs changes for a new slide kind.
