---
name: remo-agent-video-plan
description: Authors or validates JSON video plans (VideoPlanProps) for remo-agent—on-screen copy, slide kinds, ttsText, and props files. Use when editing plan JSON or generating scripts from existing slide kinds. Does not cover writing new Remotion components; for that, use remo-agent-slide-components.
---

# Video plan (JSON) for remo-agent

## When to use

- Producing or editing the props file for Remotion (`VideoFromPlan` composition).
- Generating on-screen text and optional `ttsText` for each slide.
- Explaining which `kind` of slide to use for a given scene.

## Source of truth

- TypeScript types: `src/types/videoPlan.ts` (exported as `VideoPlanProps`, `PlanSlide`, `SlideKind`).
- Human index of built-in kinds: `SLIDE_CATALOG` in `src/slideRegistry.tsx`.

## Top-level fields

| Field | Required | Notes |
| --- | --- | --- |
| `fps` | no | default 30 in metadata |
| `width`, `height` | no | default 1920×1080 |
| `narrationAudioUrl` | no | Single mixed track (HTTPS or `file:`). See `remo-agent-narration-tts` skill. |
| `slides` | yes | Array of slide objects |

## Slides (all kinds)

- `kind`: one of `cover` \| `bullets` \| `media` \| `code`
- `durationInFrames`: integer ≥ 1
- `ttsText` (optional): natural-language script for TTS; not rendered on screen

## By kind (minimal)

- **cover**: `title`; optional `subtitle`, `periodLabel`, `brandFooter` (short footer line; omit to hide)
- **bullets**: `headline`, `lines` (string array); optional `highlights` (substrings to emphasize)
- **media**: `imageUrl`; optional `headline`, `caption`
- **code**: `code`; optional `headline`, `language`, `highlights` (token substrings to tint)

## Agent workflow

1. Build a valid `VideoPlanProps` object (or JSON file).
2. For narration, set `ttsText` on slides then use the narration skill to place audio.
3. Hand off to render skill for `npx remotion render ...` or `npm run render`.

## Do not

- Invent new `kind` values without also updating `src/types/videoPlan.ts` and `src/slideRegistry.tsx` (and adding the view) — follow **`remo-agent-slide-components`** for the full checklist.
- Add JSX or new slide types inside compositions; new visuals belong in `*SlideView` + registry per `remo-agent-slide-components`.

## Related skills

- **`remo-agent-slide-components`** — new `kind`, new `*SlideView`, registry
- **`remo-agent-remotion-render`** — render to MP4, Studio
- **`remo-agent-narration-tts`** — `ttsText` / `narrationAudioUrl`
