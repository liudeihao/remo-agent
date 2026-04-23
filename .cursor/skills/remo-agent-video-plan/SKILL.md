---
name: remo-agent-video-plan
description: >-
  **RADICAL / NOT CONSERVATIVE.** Video plans for remo-agent: default to **max motion, max clarity,
  max time on screen for motion to read**—PPT = failure. Bans empty kinetics, "safe" omissions,
  bullets-first, and apologetic pacing. Pairs with remo-agent-slide-components (pixels & springs).
  v0.4.0
version: 0.4.0
metadata:
  project: remo-agent
---

# remo-agent — Video plan (data layer)

## **STOP: default is RADICAL, not safe**

**Do not be conservative.** This skill exists to stop agents from shipping **dubbed static decks**. If you are about to: strip `contentArc` “to be tasteful,” shorten `durationInFrames` “to be tight,” or pick `bullets` because the topic is “serious,” **STOP** and re-read this file.

- **Conservative = wrong** for Remotion work unless the user **explicitly** asked for 极简 / 幻灯片 / 少动.
- **Radical = default**: assume **strong** timing, **filled** motion fields, **loud** layout choices, then **only** pull back if the user said “quiet / static / meeting deck.”
- “Meaning over motion” does **not** mean “less motion.” It means: **no incoherent** motion. **Coherent, loud, visible motion** is the **expected** state.

## Scope

- **In**: `VideoPlanProps` JSON, `meta.json`, which `kind`, copy, TTS text, timings that **weaponize** the timeline.
- **Out**: TSX, registry, new `kind` (→ `remo-agent-slide-components`), Remotion CLI (→ render skill).

### `meta.json` (language)

- Human-facing `title` / `description`; JSON keys in English. Chinese platforms → **中文** title+description in `meta.json` unless the user says otherwise. See [project-layout](references/project-layout.md).

---

## Remotion = **time**. No time = not video.

**Every** segment must **earn** its frames with **visible change** (motion, build, graph draw, camera, type-on, spring—something). A slide that only **crossfades** is a **defect**, not “minimal design.”

- **Serious content** = **stronger** hierarchy and motion, not **weaker** motion. Audiences don’t read faster when nothing moves; they **disengage**.

---

## BANNED behaviors (treat as errors)

| Banned | Why |
|--------|-----|
| Leaving `contentArc` / `lineAnimation` / `stagger` **empty** on `kineticText` “to be safe” | You are **hiding** the tool; the output **dies**. |
| **Sub-60f** `durationInFrames` for a beat that should show **stagger, graph, or kinetics** | Motion **cannot** read; you made a **flash**. |
| **Bullets** as the default for “explanation” | That’s **slide brain**. Use **graph, kinetic, media, code** first unless the user said **组会/列表**. |
| **Typewriter** for long runs when a **graph or diagram** would carry the idea | Text walls are a **retreat**; **fight** for a visual. |
| Blaming the user for “not proving motion in the prompt” | **You** set the plan; **components** set pixels. If it’s PPT, **escalate** to slide-components. |
| “Restraint” as an aesthetic | Restraint is for **print**. Here it reads as **laziness**. |

---

## REQUIRED bias (do this on purpose)

1. **Prefer kinds that *move*:** `explainerGraph`, `kineticText` (fully filled), `media`, `code`—in that order of energy, **then** add `typewriter` or `bullets` only when necessary.
2. **Fill the knobs:** `contentArc` + sensible `staggerFrames`, **long enough** `durationInFrames` that springs and graph draws **finish and breathe** (aim **generous**; user can say “shorter” later).
3. **Hooks in the first seconds:** the first 2–3 seconds should **look like a video**, not a title slide with a fade.
4. If unsure between **bolder** and **tamer** **→ choose bolder** until the user says stop.

---

## Core principles (only these guardrails)

- **Motion must match the *idea* (not be random):** wrong motion is bad. **Boring** motion is **also** bad when the user wanted a **video**.
- **No arbitrary motion** = no motion that **conflicts** with the message or **hides the punchline**—it does **not** mean “subtle by default.”
- **PPT is never the silent default.** Lecture/deck is an **opt-in** **genre**, not a shadow setting.

---

## Data vs presentation (who does what)

| Layer | You control | When it still sucks on screen |
|--------|------------|-------------------------------|
| `plan.json` | `kind`, copy, `durationInFrames`, arcs, stagger, high-energy structure | You didn’t go **radical** enough here **or** the view is underbuilt. |
| `*SlideView` | size, springs, loop motion, camera | **Not** the user’s fault. Open `remo-agent-slide-components`. |

**Icons too small?** — Not fixable with JSON prayers. **Fix components** or add typed `iconScale` + wire it.

---

## Delivery style (explicit opt-**out** of radical)

- **Default for “video / 科普 / Remotion / 爆款 / 解释”** without the word “幻灯片/少动/组会**纯**” → **Radical motion explainer** (table row: *Motion explainer*).
- **Lecture / 极简 / 纯列表** require **explicit** user language. Until then, **do not** retreat to `bullets`.

| Intent | `kind` mix | Bias |
|--------|------------|------|
| **Default (this repo): Motion explainer** | `explainerGraph` + `kineticText` w/ full arcs + `media` + `code` | **High**; long frames; many beats |
| **Pop-sci graph-first** | `explainerGraph` heavy | Same |
| **Lecture** | `kineticText`, `bullets` | Only when **said** |
| **产品极简** | `cover`, `media` | **User said 极简** |

**If style is unclear** → default **radical**; one question only: *「要猛一点还是收一点？」* If they shrug → **猛**.

### Source of truth (paths)

| Asset | Path |
|-------|------|
| Types | `src/types/videoPlan.ts` |
| Fields | [slide-kinds.md](references/slide-kinds.md) |
| Catalog | `src/slideRegistry.tsx` |

## Skill map

| Concern | Skill |
|---------|--------|
| JSON / energy / structure | **this** |
| Pixels, springs, new `kind` | `remo-agent-slide-components` |
| `remotion render` | `remo-agent-remotion-render` |
| TTS | `remo-agent-narration-tts` |

## Workflow (aggressive)

1. **Intent** — Unless they asked for 静态, assume **full motion** and plan **time** for it.
2. **Beats** — Map to **highest-energy** `kind` that still fits; **refuse** to default to `bullets`.
3. **Fill** all motion-relevant fields; **inflate** `durationInFrames` until motion reads; **cut** only on request.
4. **Validate** JSON.
5. **If preview is flat** — **escalate** to slide-components; do not “fix” with emptier JSON.

## Quality gate (strict)

- [ ] No **BANNED** behavior above.
- [ ] If `kineticText`: `contentArc` or deliberate `lineAnimation` **and** `stagger` **set** (no ghost defaults).
- [ ] Durations: **enough** frames that **at least one** full motion “phrase” (graph draw, stagger pass) **completes visibly**.
- [ ] `meta` language matches audience when using `meta.json`.
- [ ] PPT look → **acknowledge** implementation work; **don’t** ship emptier data as the fix.

## Do not

- New `kind` in JSON only (pair with slide-components).
- Secrets in `plan.json`.

## References

- [slide-kinds.md](references/slide-kinds.md) | [project-layout](references/project-layout.md)

## Related

- `remo-agent-component-readiness` — implement or confirm matching views **before** stretching plan JSON around missing semantics
- `remo-agent-slide-components` — **bigger, faster, loopier** defaults
