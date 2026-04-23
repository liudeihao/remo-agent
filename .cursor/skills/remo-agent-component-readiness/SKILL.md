---
name: remo-agent-component-readiness
description: >-
  Workflow: prepare slide/presentation components before Remotion composition and plan wiring.
  Reuse only when semantics fully match; otherwise implement dedicated views. Forbids hacking
  existing components and forbids force-fitting the wrong primitive to avoid work. Triggers:
  组件先行, before Remotion, component inventory, no reuse without fit, 不要凑合, 不要魔改,
  new slide kind, missing SlideView. Pairs with remo-agent-slide-components (how views behave)
  and precedes remo-agent-video-plan / remo-agent-remotion-render for new visual work.
version: 0.1.0
metadata:
  project: remo-agent
---

# remo-agent — Component readiness (before Remotion)

## Intent

Ship **honest** presentation code: the right building blocks exist **before** heavy `VideoFromPlan` / timeline work. **Libraries** for domains (parsing, auth, math) still follow `.cursor/rules/prefer-existing-solutions.mdc`; this skill governs **project-owned slide views and primitives**, not npm shopping.

## When to use

- Starting a new video line, new `kind`, or any work where the agent might reach for Remotion or plan JSON first.
- User asks for 组件先行, 先组件后 Remotion, or explicitly rejects 凑合 / 魔改.

## Workflow (order matters)

1. **Inventory** — List shots: layout role, data shown, motion contract, and which `kind` / `SlideView` each needs.
2. **Gap analysis** — For each shot, decide: **existing view fits completely** vs **missing or wrong semantics** (see `remo-agent-slide-components`: reuse only when meaning matches).
3. **Implement gaps** — Add **new** `*SlideView`, primitives, or registry entries. Extract shared **small** helpers if two honest views share mechanics; do **not** widen one view with “modes” to mean something else.
4. **Wire types & catalog** — `videoPlan.ts`, `slideRegistry`, `SLIDE_CATALOG`, [slide-kinds.md](../remo-agent-video-plan/references/slide-kinds.md) as required by the slide-components skill.
5. **Only then** — Author or adjust `VideoPlan` (`remo-agent-video-plan`) and Remotion entry/render (`remo-agent-remotion-render`).

## Hard rules

| Rule | Meaning |
|------|---------|
| **No force-fit** | If the closest component is “almost” right but teaches the **wrong relationship** or layout role, **do not** use it. Add the correct component. |
| **No hack / 魔改** | Do not bolt one-off behavior onto unrelated shared views, explode props, or branch on video-specific hacks inside generic components. Prefer a **new** named view or a **small** shared primitive used by both. |
| **Reuse bar** | Reuse is allowed only when **semantics and motion contract** already match (same as slide-components **semantics before reuse**). “Saves typing” is never sufficient. |

## Quality gate (before Remotion-heavy work)

- Every planned `kind` has a **dedicated** or **correctly shared** implementation path; no TODO left as “we’ll fake it in JSON.”
- No new `mode` / `variant` whose **name** hides a different **meaning** (that should be a different component or kind).

## Related

- `remo-agent-slide-components` — motion, scale, registry, **semantic reuse law**
- `remo-agent-video-plan` — plan JSON after views exist
- `remo-agent-remotion-render` — preview/render after props and views align
