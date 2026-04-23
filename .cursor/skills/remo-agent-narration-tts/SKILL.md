---
name: remo-agent-narration-tts
description: >-
  Explains and automates the handoff from per-slide ttsText and mixed narration to remo-agent
  video plans: narrationAudioUrl, external TTS, mixing, and security. Triggers: voiceover, TTS,
  narration, WAV, MP3, m4a, "read the script", per-slide ttsText, mix audio before Remotion, env
  API key for a speech provider. Does not implement a vendor SDK inside the Remotion player;
  remo-agent does not render speech on-device.
version: 0.2.0
metadata:
  project: remo-agent
---

# remo-agent — Narration & TTS (handoff)

## Scope

- **In scope**: how `VideoPlanProps` carries **text** for TTS (`ttsText` per slide), how **one** mixed file is **played back** in the final video (`narrationAudioUrl`), and operational rules (secrets, order of operations, when to re-render).
- **Out of scope**: writing Remotion components except noting that `VideoFromPlan` already mounts `<Audio src={narrationAudioUrl} />` when the URL is set. Implementing a specific vendor SDK in-repo is optional and not required for the skill to apply.

**Contract detail**: [references/audio-contract.md](references/audio-contract.md).

## When to use

- User wants spoken audio over a rendered video from this project.
- User provides or asks for TTS and needs to know where to place output files in the plan.
- Auditing whether secrets or network calls belong in the repo (they do not, except optional scripts the user adds).

## Model (normative for this repository)

| Layer | Behavior |
|-------|----------|
| **Plan** | `ttsText?` on each slide: script for TTS, not shown on screen. |
| **Playback** | Top-level `narrationAudioUrl?`: a **single** URL to an audio file (e.g. HTTPS or `file:`) mixed to match the full timeline. Remotion’s `<Audio>` in `VideoFromPlan` plays it. |
| **Synthesis** | **Out of repo** by default: any TTS API the user chooses, with credentials in **environment** or a secret store—not committed files. |

This project does **not** generate audio inside the React tree during `render` unless the user adds that capability later.

## Workflow

1. **Author** `VideoPlanProps` with `ttsText` per slide (and frame durations) — `remo-agent-video-plan`.
2. **Synthesize** audio outside Remotion: per-clip TTS, then **concat/mix** to one file whose length is consistent with the video (or re-time slides—product decision; harder).
3. **Host or path** the mixed file: HTTPS, or a local path Remotion can resolve at render time.
4. **Set** `narrationAudioUrl` in the final JSON; leave unset for silent output.
5. **Render** — `remo-agent-remotion-render`.

## Quality gate (audio-specific)

- [ ] `narrationAudioUrl` points to a **supported** format for Remotion/FFmpeg in your stack (commonly: WAV, MP3, M4A—verify in target environment if unsure).
- [ ] **Duration** mismatch: if audio is much shorter or longer than `sum(durationInFrames)/fps`, expect perceived sync issues; fix in the editor or the mix, not in the skill text alone.
- [ ] **Secrets**: no API keys in JSON, skills, or committed `.env`.

## Failure modes

| Symptom | Likely cause | Action |
|---------|----------------|--------|
| No sound in MP4 | `narrationAudioUrl` missing or wrong | Set URL; re-render |
| Error loading audio at render | URL 404, bad `file:` path, or CORS/permission | Test URL; use local path pattern Remotion supports |
| Desync | Mix length vs sum of frame durations | Adjust mix or `durationInFrames` |

## Do not

- Commit API keys, OAuth tokens, or long-lived credentials to the repo or to `.cursor/skills`.
- Put TTS network calls inside `*SlideView` components (`remo-agent-motion-views`).

## References

| Document | Content |
|----------|---------|
| [references/audio-contract.md](references/audio-contract.md) | Fields and responsibilities line-by-line |

## Related skills

- `remo-agent-video-plan` — `ttsText` and `narrationAudioUrl` fields
- `remo-agent-remotion-render` — produce MP4 after `narrationAudioUrl` is set
