---
name: remo-agent-remotion-render
description: Renders or previews remo-agent Remotion videos from JSON props. Use when the user wants MP4 output, remotion studio, headless render, or CLI flags; or when automating `npm run render` / `remotion render` in this repository.
---

# Remotion render (remo-agent)

## Entry points

- Remotion entry file: `src/index.ts` (registers the root in `src/Root.tsx`)
- Main composition id: `VideoFromPlan`

## Commands (from repo root)

| Goal | Command |
| --- | --- |
| Studio / preview | `npm run dev` |
| Default sample MP4 | `npm run render` (uses `VideoFromPlan` + `data/sample-video-plan.json`) |
| Custom props | `npx remotion render src/index.ts VideoFromPlan out/my.mp4 --props=path\\to\\plan.json` |

## Requirements

- Dependencies installed: `npm install`
- First run may download Chrome Headless Shell; needs network once

## Agent workflow

1. Ensure JSON matches `VideoPlanProps` (see `remo-agent-video-plan` skill).
2. Run `npx remotion render src/index.ts VideoFromPlan <output.mp4> --props=<file.json>`.
3. If render fails, surface stderr; common issues: invalid JSON, bad image URL, missing duration frames.

## Do not

- Point `--props` at a file that is not valid JSON.
- Use composition ids not registered in `src/Root.tsx`.
