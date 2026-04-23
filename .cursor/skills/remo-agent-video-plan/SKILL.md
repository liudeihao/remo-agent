---
name: remo-agent-video-plan
description: >-
  Authors, validates, or explains JSON video plans (VideoPlanProps) for the remo-agent Remotion
  project—slide kinds, on-screen copy, ttsText, fps/dimensions, and props files. Triggers: video plan
  JSON, sample-video-plan, props for VideoFromPlan, "slides" schema, ttsText per scene, on-screen
  headline/bullets/code/image. Does not cover new Remotion components or new kind values; use
  remo-agent-slide-components for that.
version: 0.2.0
metadata:
  project: remo-agent
---

# remo-agent — Video plan (data layer)

## Scope

- **In scope**: structured data that drives `VideoFromPlan`—conformant JSON, field semantics, choice of `kind` from the **current** `PlanSlide` union, and copy for display / `ttsText` for downstream TTS.
- **Out of scope**: TSX, `slideRegistry`, new `kind` discriminants, Remotion Studio, and `remotion` CLI. Those belong to other skills in this set.

## Skill map (this repository)

| Concern | Skill |
|--------|--------|
| JSON / `VideoPlanProps` | **this** |
| `*SlideView`, registry, new `kind` | `remo-agent-slide-components` |
| Studio / `remotion render` / MP4 | `remo-agent-remotion-render` |
| TTS, mixed narration URL | `remo-agent-narration-tts` |

## When to use

Apply this skill when the task involves any of:

- Authoring or editing a props file passed to `VideoFromPlan` (`--props=...`).
- Explaining which slide `kind` fits a story beat (cover vs bullets vs media vs code).
- Validating JSON against the schema before render or in CI.
- Filling `ttsText` for off-render TTS (field meaning only; provider workflow is `remo-agent-narration-tts`).

## Prerequisites

- Repository root = remo-agent project; `package.json` present.
- Types and catalog live in-repo—do not invent `kind` strings not present in `src/types/videoPlan.ts` and `SLIDE_CATALOG` in `src/slideRegistry.tsx`. Extending the set is **not** a video-plan–only change; see `remo-agent-slide-components`.

## Source of truth

| Asset | Path |
|-------|--------|
| Type definitions | `src/types/videoPlan.ts` (`VideoPlanProps`, `PlanSlide`, `SlideKind`) |
| Per-kind field matrix | [references/slide-kinds.md](references/slide-kinds.md) |
| Machine + human index of `kind` | `src/slideRegistry.tsx` (`SLIDE_CATALOG`) |
| Worked example JSON | `data/sample-video-plan.json` |

## Workflow

1. **Gather intent** — topic, target length (slide count or total duration in frames if fixed), language for on-screen text, whether `ttsText` is needed.
2. **Map beats to `kind`s** — use [references/slide-kinds.md](references/slide-kinds.md) for required and optional fields per kind.
3. **Assemble `VideoPlanProps`** — set `fps` / `width` / `height` if not default; ensure every slide has `durationInFrames` ≥ 1; optional `narrationAudioUrl` only after audio exists (see `remo-agent-narration-tts`).
4. **Validate** — JSON parses; all `kind` values are in the `PlanSlide` union; no unknown top-level keys required by consumers beyond the type.
5. **Hand off** — render: `remo-agent-remotion-render`; new layouts: `remo-agent-slide-components`.

## Quality gate

Before sharing or committing a plan file:

- [ ] File is valid JSON (not JavaScript, no trailing comments unless your toolchain explicitly allows them—Remotion JSON props do not).
- [ ] Every slide has `kind`, `durationInFrames`, and fields required for that `kind` per [references/slide-kinds.md](references/slide-kinds.md).
- [ ] Remote `imageUrl` values are reachable HTTPS URLs the render environment can fetch, or the user accepts render-time failure.
- [ ] Sum of `durationInFrames` matches the intended run time (optional sanity: total frames / fps ≈ seconds).

## Failure modes

| Symptom | Likely cause | Action |
|---------|----------------|--------|
| Render or Studio rejects props | Malformed JSON or wrong `kind` / missing field | Re-check against `videoPlan.ts` and [slide-kinds.md](references/slide-kinds.md) |
| Image slide blank or error | Bad `imageUrl`, CORS, or offline | Fix URL; test in Studio |
| “Unknown kind” at type level | New `kind` in JSON but types not updated | `remo-agent-slide-components` |

## Do not

- Add new `kind` values in JSON only—registry and types must be updated together (`remo-agent-slide-components`).
- Put JSX, imports, or Remotion API calls in a “plan” file; plans are data only.
- Commit secrets (API keys) into plan JSON.

## References

| Document | Content |
|----------|---------|
| [references/slide-kinds.md](references/slide-kinds.md) | Per-`kind` field reference and notes |

## Related skills

- `remo-agent-slide-components` — new slide `kind` or UI
- `remo-agent-remotion-render` — MP4 output
- `remo-agent-narration-tts` — `narrationAudioUrl` and TTS handoff
