---
name: remo-agent-slide-components
description: >-
  **RADICAL / NOT CONSERVATIVE.** *SlideView code owns scale & motion. Default: HERO SIZES, strong
  springs, continuous idle motion, camera move on media, scan/glow on code. "Looks like PPT" = BUG
  in this layer until proven user asked 极简. Reuse only when **semantics** match; new primitive/slide
  when meaning diverges. v0.4.1
version: 0.4.1
metadata:
  project: remo-agent
---

# remo-agent — Slide components & registry (presentation layer)

## **RED LINE: boring = bug**

- **Do not ship conservative UI.** A view that only fades in once and then **dies** is **unacceptable** for the default remo-agent use case.
- **Small focal elements on 1920p = bug** (icons, cards, main image, code block) unless the user explicitly wanted **miniature / deck** look.
- **“Subtle” is not a compliment here** unless the **product** is explicitly minimal. Default to **loud, readable, kinetic**.

If the user’s video still feels like PowerPoint, **the code is where you fix it**—not their JSON tone, not their “lack of prompt.”

## Scope

- `*SlideView` implementations, `slideRegistry`, `SLIDE_CATALOG`, `PlanSlide` types for behavior that **belongs in code**, **chrome**, shared motion (`SlideChrome`, `src/lib/*`).

- **Out of scope:** authoring `plan.json` text, running `remotion render`.

---

## Mandates (read like law)

1. **Hero scale at 1920×1080:** primary visuals **fill the safe area**. Icons are **hundreds of px** on screen for graph/kinetic, not deck thumbnails.
2. **Two-layer motion minimum:** (a) **entrance** with overshoot / spring, (b) **ongoing** motion (float, pulse, parallax, line pulse, image breathe, code scan) for the full clip **unless** the `kind` is intentionally static.
3. **SemanticIconById and containers** must **actually** scale art to `size`—never render 22px vectors inside a 200px box.
4. **When in doubt, add motion**; only remove on **explicit** “static slide” spec.

## Core principles (short)

- **Meaning, not timidity:** Animate in ways that **teach** (contrast, order, focus). **Timid** animation is a **separate** failure from **nonsensical** animation.
- **Types are contract:** new visible behavior → `videoPlan.ts` + view + [slide-kinds.md](../remo-agent-video-plan/references/slide-kinds.md).
- **Pair with** `remo-agent-video-plan` **RADICAL** bias: no empty arcs on the data side, no single-fade morgue on the code side.
- **Semantics before reuse:** Reuse a component or primitive only when the **user-visible relationship** (directed edge vs undirected link, one-way flow vs peer relation, etc.) is the **same**. If the next shot needs a different meaning, add a **new** small component or primitive—**do not** stretch an existing one with `mode` flags, double-stroke tricks, or props that mean “we needed something else but shoehorned it here.”

## Component reuse: semantics, not “one shell for everything”

- **Reusable** here means: **stable, honest abstractions** (e.g. a directed edge primitive with real arrow semantics in SVG), composed as needed. Different videos will still need **different** slides and sometimes **new** building blocks.
- **Reuse** when: behavior and **meaning** line up (same kind of edge, same layout role, same motion contract).
- **New component** when: the **meaning** changes—even if the old one “almost” fits. Examples: undirected relationship vs A→B flow; need for bezier vs straight; label placement rules that are not a thin variant.
- **Forbidden pattern:** Faking a concept (e.g. directed influence) by **misusing** another (e.g. two full-length lines and color) because the true primitive is missing—**add** the true primitive and use it, then delete the fake.

## Pipeline

`VideoFromPlan` → `renderSlideContent` in `src/slideRegistry.tsx` only.

## When to use

- New/renamed `kind`.
- **Any** report of: tiny icons, no motion, one fade, PPT, “boring” — **this skill**, not “user should prompt harder.”
- Refactors to **raise** the energy floor of defaults.
- Deciding **reuse vs new** piece of UI: relationship/meaning changed but someone tried to **reuse** a similar-looking component (props explosion, faked visuals) — apply **Component reuse: semantics** above.

## Prerequisites

`npm install`; `npx tsc --noEmit` before saying done.

## Source of truth

| Asset | Path |
|-------|------|
| `PlanSlide` | `src/types/videoPlan.ts` |
| Registry | `src/slideRegistry.tsx` |
| Exports | `src/components/index.ts` |
| Extension checklist | [extension.md](references/extension.md) |

## Workflow

1. Types.
2. View: **aggressive** motion + **large** focal layout; verify in **Studio** at full composition size.
3. Register everywhere.
4. `tsc` + visual **stress** test.
5. slide-kinds if the **public** contract changed.

## Quality gate (non-negotiable)

- [ ] **Studio pass:** motion **reads**; focal layer **not** phone-sized in frame.
- [ ] Ongoing motion exists for **default** `kind`s (graph/kinetic/media/code) — not only frame 0–15.
- [ ] PPT symptom → open `*SlideView` and **increase** energy before touching user copy.
- [ ] `SLIDE_CATALOG` + `assertNever` complete.
- [ ] No secrets; no TTS in views.
- [ ] Primitives **match** what they **denote** (arrows for directed flow, not double-line hacks; new `kind` or new sub-component when meaning diverges).

## Failure → fix

| Symptom | Fix |
|---------|-----|
| Tiny icons | Scale SVG path + layout; add props if needed |
| Static after intro | **Add** loops / pulse / parallax / scan |
| `assertNever` | Wire `case` + view |
| Wrong **meaning** in one component (e.g. need arrow semantics but reusing a line pair) | **New** named primitive or slide piece; do not pile `mode` / color tricks to fake the missing concept |

## BANNED (implementation)

- Registering a `kind` with **one** `useSlideEntrance` and nothing else in the main layout (unless the **kind** is **explicitly** static-by-design in product).
- Suggesting the user “write a stronger plan” when the component caps icon size or kills motion.
- Forcing a **new** semantic into an **old** component shell to “maximize reuse” (visual or API hacks) instead of adding a small correct abstraction.

## Do not

- Skip `SLIDE_CATALOG`.
- Branch in `VideoFromPlan` on `kind`.

## References

- [extension.md](references/extension.md)

## Related

- `remo-agent-video-plan` — **RADICAL** data bias
- `remo-agent-remotion-render` — output MP4
