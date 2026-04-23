---

## name: remo-agent-remotion-render
description: >-
  Previews and renders remo-agent Remotion projects: Remotion Studio, remotion render to MP4, npm
  scripts, and JSON --props. Triggers: render video, export MP4, remotion studio, headless
  render, "npm run dev", "npm run render", VideoFromPlan, out/video.mp4, sample-video-plan, Chrome
  Headless Shell. Does not define VideoPlan JSON schema (remo-agent-video-plan) or TTS
  (remo-agent-narration-tts).
version: 0.2.1
metadata:
  project: remo-agent

# remo-agent — Remotion render (CLI & Studio)

## Scope

- **In scope**: running `@remotion/cli` in this repository—`dev` (Studio), `bundle` if requested, and `remotion render` to produce a video file from the registered root and `VideoFromPlan` composition.
- **Out of scope**: editing slide TSX, authoring plan JSON (except passing a path to `--props`), and generating narration audio.

## When to use

- User asks to export MP4, render, preview, or “see the video.”
- Automating a render after a `VideoPlanProps` file is ready.
- Debugging render failures (stderr, image load, JSON parse).

## Prerequisites

- Repository root: `package.json` name `remo-agent` (or equivalent), `@remotion/cli` in `devDependencies`.
- `npm install` has been run; first `render` may download Chrome Headless Shell (one-time, network).
- **Composition id** registered in `src/Root.tsx`—currently `VideoFromPlan` only. Do not pass a removed id.

**Entry bundle**: `src/index.ts` → `registerRoot(RemotionRoot)` in `src/Root.tsx`. Full command matrix: [references/cli.md](references/cli.md).

## Workflow

1. **Confirm input** — Path to a valid JSON file matching `VideoPlanProps` (`remo-agent-video-plan`), or use `data/sample-video-plan.json` for smoke tests.
2. **Render** — From repo root, run the appropriate command in [references/cli.md](references/cli.md). Prefer `npx remotion ...` if npm scripts are unavailable.
3. **On success** — Report output path (e.g. `out/video.mp4` for the default `npm run render` script) and file size if useful.
4. **On failure** — Capture **stderr**; see [Failure modes](#failure-modes) below. Do not retry indefinitely without changing inputs.

## Quality gate (before calling render "done")

- `npx tsc --noEmit` if TypeScript or props types were changed in the same task.
- JSON props file parses and matches `VideoPlanProps` (see `remo-agent-video-plan`).
- Output path is writable (repo `out/` exists or is creatable; script may not create parent dirs for arbitrary paths—verify).

## Failure modes


| Symptom                            | Likely cause                             | Action                                                                                   |
| ---------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `Unknown composition`              | Wrong `id` or wrong entry `src/index.ts` | List compositions with `npx remotion compositions src/index.ts` (or read `src/Root.tsx`) |
| JSON parse error                   | Trailing comma, comments, or UTF-8 BOM   | Fix file to strict JSON                                                                  |
| Black frame / missing image        | `imageUrl` 404, TLS, or timeout          | Test URL; increase timeout if Remotion allows                                            |
| `Could not get browser executable` | First-time headless download failed      | Check network; retry; see Remotion “Ensure browser” docs                                 |
| Duration too short / long          | Sum of `durationInFrames`                | Adjust plan JSON (`remo-agent-video-plan`)                                               |


## Do not

- Point `--props` at non-JSON or hand-edited "JSON" with JS expressions.
- Commit generated MP4s unless the user explicitly wants artifacts in VCS.
- Run render from a subdirectory without adjusting paths to `src/index.ts` and props.

## References


| Document                               | Content                                |
| -------------------------------------- | -------------------------------------- |
| [references/cli.md](references/cli.md) | Commands, flags, and npm scripts table |


## Related skills

- `remo-agent-component-readiness` — confirm slide views exist and fit **before** leaning on render/plan edits
- `remo-agent-video-plan` — `VideoFromPlan` props
- `remo-agent-slide-components` — if failure is from missing/buggy view code
- `remo-agent-narration-tts` — if only audio is wrong