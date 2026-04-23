# Slide component extension: checklist

Use this in order. Skipping a step usually causes duplicate sources of truth or broken Studio previews.

## 1. Discriminated type (`src/types/videoPlan.ts`)

- Define `YourKindSlide` with `kind: "yourKind"` as a **string literal** type.
- Add `YourKindSlide` to the `PlanSlide` union.
- `SlideKind` is derived; do not edit manually unless the codebase uses a different pattern (follow existing).

## 2. View component (`src/components/YourKindSlideView.tsx`)

- Signature: `React.FC<{ slide: YourKindSlide }>` (or equivalent with explicit return type).
- Use `SlideChrome` for a full-bleed 1920×1080–style frame unless the design explicitly breaks that (document if so).
- Reuse `useSlideEntrance` from `src/lib/fade.ts` for motion consistency with other slides.
- Do not call `fetch`, TTS, or environment-secret reads inside the view.

## 3. Barrel (`src/components/index.ts`)

- Export the new view for predictable imports in tests and tooling.

## 4. Registry (`src/slideRegistry.tsx`)

- **Catalog**: append `{ kind, label, description }` to `SLIDE_CATALOG`. Description should tell script authors when to pick this `kind`.
- **Render**: in `renderSlideContent`, add `case "yourKind": return <YourKindSlideView slide={slide} />;`
- The `default` branch should call `assertNever(slide)`; exhaustiveness is enforced by TypeScript.

## 5. Downstream

- If public JSON fields change, update `../../remo-agent-video-plan/references/slide-kinds.md`.
- Add or extend a sample slide in `data/*.json` when it helps agents and humans.

## Naming conventions

| Item | Convention |
|------|------------|
| File | `PascalCase` + `SlideView.tsx` |
| `kind` string | `camelCase` or `lowercase`—match one existing style in `videoPlan.ts` (currently lowercase: `cover`, `bullets`, `media`, `code`) |
| Catalog `label` | Short Title Case for Studio humans |

## Anti-patterns

- Duplicating a `switch (slide.kind)` in `VideoFromPlan` alongside `renderSlideContent`.
- Typing the slide prop as `PlanSlide` inside a view that only supports one `kind`—narrow the type to `XxxSlide`.
