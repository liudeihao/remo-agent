# Video plan: slide kinds and fields

**Normative source**: `src/types/videoPlan.ts`. This file is a readable mirror for agents; on conflict, the TypeScript types win.

## Common fields (all kinds)

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `kind` | string (discriminant) | yes | One of: `cover`, `bullets`, `media`, `code` |
| `durationInFrames` | number | yes | Integer ≥ 1. Total duration = sum over `slides` |
| `ttsText` | string | no | Spoken script for external TTS; not rendered on screen |

## Top-level `VideoPlanProps`

| Field | Type | Required | Default (if omitted) |
|-------|------|----------|------------------------|
| `fps` | number | no | `30` in composition metadata |
| `width` | number | no | `1920` |
| `height` | number | no | `1080` |
| `narrationAudioUrl` | string | no | If set, one mixed track played under all slides. See `remo-agent-narration-tts` |
| `slides` | array | yes | Each element is a `PlanSlide` |

## Per-kind fields

### `kind: "cover"`

| Field | Required |
|-------|----------|
| `title` | yes |
| `subtitle` | no |
| `periodLabel` | no |
| `brandFooter` | no | Small line under the title block; omit to hide |

### `kind: "bullets"`

| Field | Required |
|-------|----------|
| `headline` | yes |
| `lines` | yes (non-empty string array) |
| `highlights` | no | Substrings in each line to emphasize (see implementation in `src/lib/highlight.tsx`) |

### `kind: "media"`

| Field | Required |
|-------|----------|
| `imageUrl` | yes |
| `headline` | no |
| `caption` | no |

### `kind: "code"`

| Field | Required |
|-------|----------|
| `code` | yes |
| `headline` | no |
| `language` | no | Shown as a badge; not a highlighter id |
| `highlights` | no | Substrings in `code` to tint |
