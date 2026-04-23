---
name: remo-agent-motion-views
description: >-
  **RADICAL / NOT CONSERVATIVE.** Motion explainer views (`*SlideView`): hero scale, springs, idle motion,
  camera on media, scan/glow on code; icons/SVG and logic symbols (arrows, braces, status marks) as
  first-class carriers. "Looks like static readout" or paragraph walls = BUG unless user asked 极简.
  Reuse only when semantics match; new primitive/view when meaning diverges. Renamed from slide-components.
  v0.5.0
version: 0.5.0
metadata:
  project: remo-agent
---

# remo-agent — Motion views & registry (presentation layer per timeline segment)

## Product stance (motion explainer, not text pages)

- Default output is **explainer animation**: illustrations (icons, SVG, images), **logic symbols** (arrows, braces, operators, success/delete markers, etc.), and **image or camera motion** (scale, pan, move) to stress ideas.
- Copy may **drive** what appears, but the **screen** must not collapse into **serial paragraphs** or “read the document on camera.” If the beat is mostly **long plaintext**, the plan and/or view is wrong for this product—**re-choreograph** with structure, motion, and symbol work.

## **RED LINE: boring = bug**

- **Do not ship conservative UI.** A view that only fades in once and then **dies** is **unacceptable** for the default remo-agent use case.
- **Small focal elements on 1920p = bug** (icons, cards, main image, code block) unless the user explicitly wanted **miniature / zoomed-out card** look.
- **“Subtle” is not a compliment here** unless the **product** is explicitly minimal. Default to **loud, readable, kinetic**.

If the user’s video still feels like **static serial readout**, **the code is where you fix it**—not their JSON tone, not their “lack of prompt.”

## Scope

- `*SlideView` implementations, `slideRegistry`, `SLIDE_CATALOG`, `PlanSlide` types for behavior that **belongs in code**, **chrome**, shared motion (`SlideChrome`, `src/lib/*`).

- **Out of scope:** authoring `plan.json` text, running `remotion render`.

---

## Mandates (read like law)

1. **Hero scale at 1920×1080:** primary visuals **fill the safe area**. Icons are **hundreds of px** on screen for graph/kinetic, not thumbnail-sized inset icons.
2. **Two-layer motion minimum:** (a) **entrance** with overshoot / spring, (b) **ongoing** motion (float, pulse, parallax, line pulse, image breathe, code scan) for the full clip **unless** the `kind` is intentionally static.
3. **SemanticIconById and containers** must **actually** scale art to `size`—never render 22px vectors inside a 200px box.
4. **When in doubt, add motion**; only remove on **explicit** “static segment” spec.

## Core principles (short)

- **Meaning, not timidity:** Animate in ways that **teach** (contrast, order, focus). **Timid** animation is a **separate** failure from **nonsensical** animation.
- **Types are contract:** new visible behavior → `videoPlan.ts` + view + [slide-kinds.md](../remo-agent-video-plan/references/slide-kinds.md).
- **Pair with** `remo-agent-video-plan` **RADICAL** bias: no empty arcs on the data side, no single-fade morgue on the code side.
- **Semantics before reuse:** Reuse a component or primitive only when the **user-visible relationship** (directed edge vs undirected link, one-way flow vs peer relation, etc.) is the **same**. If the next shot needs a different meaning, add a **new** small component or primitive—**do not** stretch an existing one with `mode` flags, double-stroke tricks, or props that mean “we needed something else but shoehorned it here.”

## View reuse: semantics, not “one shell for everything”

- **Invert the lazy default:** Agents often reuse to save effort. Here the default is the opposite: for a **new** topic, mood, or requested **look**, assume you need **new** motion/layout/code until you have checked semantics **and** motion contract. “We can probably drive it with JSON in `kineticText`” is **not** enough if the **stock** view does not already deliver that **look**.
- **Reusable** here means: **stable, honest abstractions** (e.g. a directed edge primitive with real arrow semantics in SVG), composed as needed. Different videos will still need **different** segment views and sometimes **new** building blocks.
- **Reuse** when: behavior and **meaning** line up (same kind of edge, same layout role, same motion contract).
- **New component** when: the **meaning** changes—even if the old one “almost” fits. Examples: undirected relationship vs A→B flow; need for bezier vs straight; label placement rules that are not a thin variant.
- **Forbidden pattern:** Faking a concept (e.g. directed influence) by **misusing** another (e.g. two full-length lines and color) because the true primitive is missing—**add** the true primitive and use it, then delete the fake.

## Pipeline

`VideoFromPlan` → `renderSlideContent` in `src/slideRegistry.tsx` only.

## When to use

- New/renamed `kind`.
- **Any** report of: tiny icons, no motion, one fade, static-readout feel, “boring” — **this skill**, not “user should prompt harder.”
- Refactors to **raise** the energy floor of defaults.
- Deciding **reuse vs new** piece of UI: relationship/meaning changed but someone tried to **reuse** a similar-looking component (props explosion, faked visuals) — apply **View reuse: semantics** above.

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
- [ ] Static-readout symptom → open `*SlideView` and **increase** energy before touching user copy.
- [ ] `SLIDE_CATALOG` + `assertNever` complete.
- [ ] No secrets; no TTS in views.
- [ ] Primitives **match** what they **denote** (arrows for directed flow, not double-line hacks; new `kind` or new sub-component when meaning diverges).

## Failure → fix

| Symptom | Fix |
|---------|-----|
| Tiny icons | Scale SVG path + layout; add props if needed |
| Static after intro | **Add** loops / pulse / parallax / scan |
| `assertNever` | Wire `case` + view |
| Wrong **meaning** in one component (e.g. need arrow semantics but reusing a line pair) | **New** named primitive or view piece; do not pile `mode` / color tricks to fake the missing concept |

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

- `remo-agent-component-readiness` — **order of work**: components before Remotion/plan; no force-fit / no hack
- `remo-agent-video-plan` — **RADICAL** data bias
- `remo-agent-remotion-render` — output MP4
