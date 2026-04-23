# Audio contract (remo-agent `VideoFromPlan`)

## Fields in `VideoPlanProps`

| Field | Role |
|-------|------|
| `narrationAudioUrl` (optional) | **Playback**: one audio resource played from the start of the composition, in parallel with all slides. See `src/compositions/VideoFromPlan.tsx` (`<Audio src={...} />`). |
| `slides[i].ttsText` (optional) | **Data for synthesis**: text intended to be read by a TTS system. **Not** rendered to pixels by the built-in views. The repository does not ship a TTS engine. |

## Responsibilities

| Process | Who |
|---------|-----|
| Writing words on screen | `PlanSlide` fields per `kind` |
| Writing spoken script in data | `ttsText` (optional) |
| Calling TTS / mixing | User script, external tool, or CI (not the Remotion root itself in the default project) |
| Muxing audio into the rendered MP4 | Remotion `render` with `narrationAudioUrl` set |

## What this repository does *not* guarantee

- lip-sync, word-level timing, or per-slide audio segments in the default composition.
- a hosted `narrationAudioUrl` (user must provide reachable URL or local file).
- TTS service availability or cost control—operational concerns for the user.

## Future (if implemented in-repo)

- Per-slide `<Sequence>`-scoped `<Audio>` and optional cues in the plan type should be **documented here** and in `../../remo-agent-video-plan/references/slide-kinds.md` when added.
