# Per-video project directory

**Normative copy** in the repository: [projects/README.md](../../../../projects/README.md) (from repo root).

## Summary (agent-facing)

| Path | Content |
|------|---------|
| `projects/<slug>/meta.json` | `VideoProjectMeta` — `title`, `description`, `slug` (publishing / archive). **Not** Remotion input. |
| `projects/<slug>/plan.json` | **Only** this file (under that folder) is `VideoPlanProps` for `--props`. |
| `projects/<slug>/out/video.mp4` | Default render output when using `npm run render:project -- <slug>`. |
| Ad-hoc | TTS takes, `notes.md`, cover art — optional; do not clobber the three paths above. |

**`<slug>`** = kebab-case directory name, must match `meta.json.slug` when that file is present.

## When to use this layout

- Any work where the user needs a **title and long description** separate from on-slide copy.
- Multiple artifacts per video (JSON + audio + final MP4) that should not overwrite other videos’ files.

`data/sample-video-plan.json` remains a **repo-wide** quick sample, not a full “project” folder.
