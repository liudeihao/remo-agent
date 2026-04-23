---
name: remo-agent-narration-tts
description: Connects text-to-speech and mixed audio to remo-agent video plans. Use when the user asks for voiceover, TTS, narration, WAV/MP3 under narrationAudioUrl, or per-slide ttsText; or when automating an external TTS service before Remotion render.
---

# Narration and TTS (remo-agent)

## Current model

- On-screen: Remotion does **not** generate speech. It only plays an optional **one-file** full-length mix.
- In JSON: optional top-level `narrationAudioUrl` points to that mix (remote HTTPS or local `file:` URL, depending on your Remotion/runtime setup).
- Per slide: each slide may include `ttsText` — for **callers** (agent or scripts) to send to a TTS API, then **concat/mix** into one track in order and duration matching the plan (or re-time slides to the audio; advanced).

## Suggested agent workflow

1. Build `VideoPlanProps` with `ttsText` on each slide (see `remo-agent-video-plan`).
2. Call your TTS provider for each `ttsText` (or one merged script — your choice; timing is harder in one block).
3. Mix segments to match total video duration, or adjust `durationInFrames` per slide to match segment length × fps.
4. Upload or write the mixed file; set `narrationAudioUrl` in the final JSON.
5. Run `remotion render` (see `remo-agent-remotion-render`).

## Related skills

- **`remo-agent-video-plan`** — `ttsText` and `VideoPlanProps`
- **`remo-agent-slide-components`** — only if you need new slide UI; not required for TTS alone
- **`remo-agent-remotion-render`** — final MP4

## In-repo placeholder

- No API keys, no TTS client: keep providers outside the repo to avoid secret leakage.
- The composition plays `narrationAudioUrl` in `src/compositions/VideoFromPlan.tsx` with `<Audio src={...} />`.

## Future extension (if implemented later)

- Per-slide `<Audio>` inside each `Sequence` for independent clips — would require a small composition change; document here when done.

## Do not

- Store service credentials in the repository or in skills.
