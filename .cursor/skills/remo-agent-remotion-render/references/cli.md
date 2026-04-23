# remo-agent — Remotion CLI reference

`{root}` = repository root (directory containing `package.json` and `remotion.config.ts`).

**Composition id**: `VideoFromPlan` (see `src/Root.tsx`).

**Entry point**: `src/index.ts` (Remotion `registerRoot`).

## npm scripts (defined in `package.json`)

| Script | Effect |
|--------|--------|
| `npm run dev` | Launches **Remotion Studio** for local preview. |
| `npm run build` | `remotion bundle` — build deployable bundle; output under `build/` (gitignored by default). |
| `npm run render` | Renders to `out/video.mp4` using `VideoFromPlan` and `data/sample-video-plan.json`. |
| `npm run render:props` | Runs `remotion render` with `VideoFromPlan` only (pass props manually in full CLI if needed). |

## Common `remotion render` invocations

```bash
# Default sample (from {root})
npm run render
```

```bash
# Custom output and props
npx remotion render src/index.ts VideoFromPlan out/my-video.mp4 --props=path/to/plan.json
```

**Windows paths in `--props`**: use a path the shell accepts; if spaces, quote the path. Prefer forward slashes or escaped backslashes in documentation examples.

## Listing compositions (debug)

```bash
npx remotion compositions src/index.ts
```

## Flags (high level)

Remotion’s CLI supports concurrency, image format, timeout, and more. For the full set, run:

```bash
npx remotion render --help
```

Agent default: do not pass exotic flags unless the user asks or an error message recommends one.

## Browser download

The first `render` on a clean machine may download a Chromium-based headless build. Success requires network access once; subsequent runs reuse the cache.
