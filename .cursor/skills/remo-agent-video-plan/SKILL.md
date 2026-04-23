---
name: remo-agent-video-plan
description: >-
  Authors, validates, or explains JSON video plans (VideoPlanProps) for the remo-agent Remotion
  project—slide kinds, on-screen copy, ttsText, fps/dimensions, and props files. Triggers: video plan
  JSON, sample-video-plan, props for VideoFromPlan, "slides" schema, ttsText per scene, on-screen
  headline/bullets/code/image, projects/slug plan.json and meta.json (Chinese 标题/简介 for CN
  publishing). Motion and kinetic fields must follow **text-first** narrative intent (see Core principles
  in body). Does not cover new Remotion components or new kind values; use remo-agent-slide-components
  for that.
version: 0.2.3
metadata:
  project: remo-agent
---

# remo-agent — Video plan (data layer)

## Scope

- **In scope**: structured data that drives `VideoFromPlan`—conformant JSON, field semantics, choice of `kind` from the **current** `PlanSlide` union, and copy for display / `ttsText` for downstream TTS.
- **Out of scope**: TSX, `slideRegistry`, new `kind` discriminants, Remotion Studio, and `remotion` CLI. Those belong to other skills in this set. (`VideoProjectMeta` in `meta.json` is described here; Remotion does not read that file.)

### `meta.json` title / description (language)

- `title` and `description` are **human-facing** strings for 成片标题 / 平台简介 / 归档说明，**不**进 Remotion。
- **Content language** follows the user and the target platform (e.g. **Simplified Chinese** 标题 + 长简介 for 国内); bilingual is fine if the user asks. **JSON keys** remain English (`title`, `description`, `slug`) for tooling.
- When the user writes in Chinese or targets Chinese platforms, the agent should **同时产出中文标题与中文简介** in `meta.json` alongside `plan.json`, unless they specify another language. See [references/project-layout.md](references/project-layout.md) and `projects/README.md`.

## Skill map (this repository)

| Concern | Skill |
|--------|--------|
| JSON / `VideoPlanProps` | **this** |
| `*SlideView`, registry, new `kind` | `remo-agent-slide-components` |
| Studio / `remotion render` / MP4 | `remo-agent-remotion-render` |
| TTS, mixed narration URL | `remo-agent-narration-tts` |

## When to use

Apply this skill when the task involves any of:

- Authoring or editing a props file passed to `VideoFromPlan` (`--props=...`), including `projects/<slug>/plan.json` in the [project directory layout](references/project-layout.md).
- Authoring or validating `meta.json` (`title` / `description` / `slug`) alongside a project folder.
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
| Per-video folder convention | [references/project-layout.md](references/project-layout.md) and `projects/README.md` |
| Sidecar metadata type | `src/types/videoProjectMeta.ts` (`VideoProjectMeta` for `meta.json`) |

## Core principles (motion & narrative)

This repo treats **on-screen text and story beats** as the source of truth. Motion in the plan is **not** free decoration.

- **Meaning first, motion second**: `durationInFrames`, `kineticText` fields (`contentArc`, `lineAnimation`, `staggerFrames`, `highlights`), and copy splits must **serve what the segment says** and its role in the arc (setup, pressure, rebuttal, closing, etc.). **Do not** pick arcs, line animations, or highlight phrases to “look cool” or to pad time if they **distract from** or **mis-state** the argument.
- **No animation for its own sake**: If a beat is explanatory or delicate, prefer calmer `contentArc` / pacing over flashy defaults. Spectacle is allowed only when the **content** calls for stress, contrast, or closure—not by habit.
- **Explicit `lineAnimation` only**: If you set `lineAnimation` without `contentArc`, still **justify** the choice from the line’s function in the story. Random or default-only motion is a plan smell.

Authoring and reviewing agents should hold each other to this: **understand the text, then choose the motion.**

## Workflow

1. **Gather intent** — topic, target length (slide count or total duration in frames if fixed), language for on-screen text, whether `ttsText` is needed, **publishing title/description** (goes in `meta.json` when using a project directory).
2. **Choose file layout** — for a full deliverable, create `projects/<slug>/` with `meta.json` + `plan.json` per [references/project-layout.md](references/project-layout.md). For a quick one-off, a standalone `plan.json` path is still valid.
3. **Map beats to `kind`s** — use [references/slide-kinds.md](references/slide-kinds.md) for required and optional fields per kind.
4. **Assemble `VideoPlanProps`** in `plan.json` — set `fps` / `width` / `height` if not default; ensure every slide has `durationInFrames` ≥ 1; optional `narrationAudioUrl` only after audio exists (see `remo-agent-narration-tts`).
5. **Validate** — JSON parses; all `kind` values are in the `PlanSlide` union; if `meta.json` is used, `slug` matches the directory name.
6. **Hand off** — render: `remo-agent-remotion-render`; new layouts: `remo-agent-slide-components`.

## Quality gate

Before sharing or committing a plan file:

- [ ] File is valid JSON (not JavaScript, no trailing comments unless your toolchain explicitly allows them—Remotion JSON props do not).
- [ ] Every slide has `kind`, `durationInFrames`, and fields required for that `kind` per [references/slide-kinds.md](references/slide-kinds.md).
- [ ] Remote `imageUrl` values are reachable HTTPS URLs the render environment can fetch, or the user accepts render-time failure.
- [ ] Sum of `durationInFrames` matches the intended run time (optional sanity: total frames / fps ≈ seconds).
- [ ] If using `projects/<slug>/`, `meta.json` includes `title`, `description`, and `slug === "<slug>"` — and **title/description** use the **intended display language** (e.g. 中文标题与简介 for Chinese deliverables), not empty English placeholders.
- [ ] For `kind: "kineticText"`, `contentArc` (or, if used alone, `lineAnimation`) and `highlights` **match the narrative job** of that beat—**not** decoration for its own sake (see **Core principles** above).

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
| [references/project-layout.md](references/project-layout.md) | `projects/<slug>/` + `meta.json` + `plan.json` + `out/` |

## Related skills

- `remo-agent-slide-components` — new slide `kind` or UI
- `remo-agent-remotion-render` — MP4 output
- `remo-agent-narration-tts` — `narrationAudioUrl` and TTS handoff
