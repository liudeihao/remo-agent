---
name: remo-agent-slide-components
description: >-
  Extends or maintains Remotion slide UI in remo-agent: new PlanSlide kinds, *SlideView components,
  SLIDE_CATALOG, and renderSlideContent in slideRegistry. Triggers: new slide type, new kind, edit
  CoverSlideView, slideRegistry, videoPlan types, "add a layout", reusable Remotion slide. All
  registered *SlideView kinds are first-class; plan authors select `kind` per remo-agent-video-plan
  **Delivery style** (or explicit user choice). Does not author JSON plans (remo-agent-video-plan) or
  run CLI render (remo-agent-remotion-render).
version: 0.2.3
metadata:
  project: remo-agent
---

# remo-agent — Slide components & registry (presentation layer)

## Scope

- **In scope**: TypeScript/React that renders each `PlanSlide` variant, the registry that maps `kind` → component, and `SLIDE_CATALOG` metadata for discoverability. Shared chrome (`SlideChrome`, `src/lib/*`) and entrance motion used by multiple views.
- **Out of scope**: contents of `VideoPlanProps` JSON files, `remotion render` invocation, and TTS providers.

## Core principles (motion & presentation)

Narrative **meaning** still drives choices (see `remo-agent-video-plan` **Core principles (motion & narrative)**). **All** `*SlideView` implementation paths are **valid**; which ones appear in a video follows `remo-agent-video-plan` **Delivery style** (e.g. 科普 → graph + typewriter; 组会/演讲 → `kineticText` + bullets—both supported).

- **Semantics drive the pixels**: In any `*SlideView` and shared motion, new behavior must be **grounded in the beat’s job** in the story. **Do not** add spectacle unrelated to the agreed delivery style.
- **Plan contract**: Views implement what `VideoPlanProps` and types describe. New motion or visual modes require **type + registry +** `remo-agent-video-plan` [references/slide-kinds.md](../remo-agent-video-plan/references/slide-kinds.md) updates; they are not a side channel for authorless defaults.

## Position in the pipeline

`VideoFromPlan` does **not** import concrete `*SlideView` by `kind` inline. It calls `renderSlideContent` in `src/slideRegistry.tsx` only. Any new on-screen mode must be registered there—no parallel switch in the composition.

## When to use

- Adding or renaming a **discriminant** on `PlanSlide` (`kind`).
- Creating `src/components/<Name>SlideView.tsx` or changing styling/layout of an existing view.
- Updating `SLIDE_CATALOG` or the switch in `renderSlideContent`.
- Refactoring shared layout tokens (`slideChrome`, fade helpers, highlight utilities).

## Prerequisites

- Node.js and dependencies installed at repo root (`npm install`).
- `npx tsc --noEmit` must pass before the change is considered complete.

## Source of truth

| Asset | Path |
|-------|--------|
| Discriminated union and slide shapes | `src/types/videoPlan.ts` |
| Registry, catalog, `renderSlideContent` | `src/slideRegistry.tsx` |
| Barrel exports for views | `src/components/index.ts` |
| Composition (no per-kind branches) | `src/compositions/VideoFromPlan.tsx` |
| Extension checklist (detailed) | [references/extension.md](references/extension.md) |

## Workflow

1. **Types** — Add or adjust `XxxSlide` in `src/types/videoPlan.ts`; extend `PlanSlide` union. See [references/extension.md](references/extension.md) §1.
2. **View** — Implement `React.FC<{ slide: XxxSlide }>`; reuse `SlideChrome` and patterns from existing `*SlideView.tsx` files.
3. **Export** — Add the component to `src/components/index.ts`.
4. **Register** — Update `SLIDE_CATALOG` and add a `case` in `renderSlideContent` so `assertNever` in the `default` branch remains unreachable for valid slides.
5. **Verify** — `npx tsc --noEmit`. Optionally `npm run dev` and load a test JSON in Studio.
6. **Document** — Update `remo-agent-video-plan` [references/slide-kinds.md](../remo-agent-video-plan/references/slide-kinds.md) if fields changed (same PR or follow-up).

## Quality gate

- [ ] New `kind` appears in: `videoPlan.ts`, new `*SlideView`, `slideRegistry.tsx` (both catalog and switch), and [slide-kinds.md](../remo-agent-video-plan/references/slide-kinds.md) if public contract changed.
- [ ] No new `if (slide.kind)` chain inside `VideoFromPlan` for production slide types.
- [ ] Slide components remain **presentational** (no fetches, no secrets, no TTS calls).
- [ ] New UI or refactors **match the** `plan`’s **delivery style** (from user or from **Delivery style** in `remo-agent-video-plan`); e.g. do not force graph-only if the product is `kineticText`-led **on purpose**.
- [ ] Motion or kinetic UI changes **serve on-screen meaning**; align with `remo-agent-video-plan` (no spectacle that the copy and agreed style do not support).

## Failure modes

| Symptom | Likely cause | Action |
|---------|----------------|--------|
| TypeScript error on `assertNever` | Unhandled `kind` in `renderSlideContent` | Add `case` and view |
| Studio shows old UI | Caching or wrong composition props | Hard refresh; confirm `VideoFromPlan` + latest JSON |
| JSON validates but runtime error | Mismatch between types and view expectations | Align field types in `videoPlan.ts` with component props |

## Do not

- Register a view without a `SLIDE_CATALOG` entry (agents rely on the catalog to discover `kind`s).
- Embed API keys, side-effectful I/O, or TTS in slide views.
- Branch on `kind` in `VideoFromPlan`—keep routing in `renderSlideContent` only.

## References

| Document | Content |
|----------|---------|
| [references/extension.md](references/extension.md) | Ordered checklist and naming conventions |

## Related skills

- `remo-agent-video-plan` — JSON and field reference for authors
- `remo-agent-remotion-render` — Studio and MP4
- `remo-agent-narration-tts` — audio (composition already supports `narrationAudioUrl`)
