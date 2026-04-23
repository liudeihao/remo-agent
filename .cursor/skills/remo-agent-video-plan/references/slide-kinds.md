# Video plan: timeline segment kinds and fields

**Normative source**: `src/types/videoPlan.ts`. This file is a readable mirror for agents; on conflict, the TypeScript types win.

**激进默认（v0.4）**：本仓库的默认是 **科普向动效片**——以 **插图/符号/画面运动** 为主承载信息，**避免**长段正文占据主画面；非用户明确要求「静态/组会/极简」时，**禁止**把分镜做成「带配音的**静态串页念稿**」。**JSON** 定节拍与 `kind`；**尺寸/弹簧/持续运动** 在 `*SlideView`。**BANNED / REQUIRED** 与 **RED LINE** 见 **`remo-agent-video-plan`** 与 **`remo-agent-motion-views`** 的 Skill 正文；产品边界见 **`.cursor/rules/motion-explainer-product.mdc`**。

## Common fields (all kinds)

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `kind` | string (discriminant) | yes | `cover` \| `bullets` \| `media` \| `code` \| `kineticText` \| `explainerGraph` \| `typewriterText` |
| `durationInFrames` | number | yes | Integer ≥ 1. Total duration = sum over `slides` |
| `ttsText` | string | no | Spoken script for external TTS; not rendered on screen |
| `videoSubtitle` | string | no | **底部固定字幕**（上屏）；与 `kind: "cover"` 的 `subtitle`（封面副标题）不同 |

## Top-level `VideoPlanProps`

| Field | Type | Required | Default (if omitted) |
|-------|------|----------|------------------------|
| `fps` | number | no | `30` in composition metadata |
| `width` | number | no | `1920` |
| `height` | number | no | `1080` |
| `narrationAudioUrl` | string | no | If set, one mixed track played under all slides. See `remo-agent-narration-tts` |
| `slides` | array | yes | Each element is a `PlanSlide` |

## Per-kind fields

### `kind: "cover"`

| Field | Required |
|-------|----------|
| `title` | yes |
| `subtitle` | no |
| `periodLabel` | no |
| `brandFooter` | no | Small line under the title block; omit to hide |

### `kind: "bullets"`

| Field | Required |
|-------|----------|
| `headline` | yes |
| `lines` | yes (non-empty string array) |
| `highlights` | no | Substrings in each line to emphasize (see implementation in `src/lib/highlight.tsx`) |

### `kind: "media"`

| Field | Required |
|-------|----------|
| `imageUrl` | yes |
| `headline` | no |
| `caption` | no |

### `kind: "code"`

| Field | Required |
|-------|----------|
| `code` | yes |
| `headline` | no |
| `language` | no | Shown as a badge; not a highlighter id |
| `highlights` | no | Substrings in `code` to tint |

### `kind: "explainerGraph"`（科普向：图与关系线）

| Field | Required | Notes |
|-------|----------|--------|
| `title` | no | 可选 |
| `nodes` | yes | 每项：`id`, `x`, `y` (0–1，**节点卡片中心**在**正方形**图区内的归一化坐标，与 `ExplainerGraphSlideView` 的 SVG/叠层同域，勿混用与容器 letterbox 不一致的坐标的含义), 可选 `imageUrl` 或 `iconId`（`semanticIcons` 中的 id，无图时大图标）, 可选 `shortLabel` |
| `edges` | yes (可为 `[]`) | `from` / `to` 为 `node.id`；可选 `label` 显示在边中点附近。可选 `lineTrackWidth` / `lineAccentWidth` / `arrowHeadSize`（与图 `viewBox` 0–1000 同度量的用户单位）/ `showLineTrack` 控制有向边外观；省略则用 `ExplainerGraphSlideView` 默认。 |
| `revealStaggerFrames` | no | 节点依次入场间隔，默认 12 |
| `outroFadeFrames` | no | 同其他 kind |

**用途**：有具体指称（论文、系所、指标等）时**优先**用本 kind，以「物」和「线」表意，**不是**把解说词铺满屏。

### `kind: "typewriterText"`（科普向：抽象叙述）

| Field | Required | Notes |
|-------|----------|--------|
| `title` | no | 可选；影响默认 `textStartFrame` 留白 |
| `text` | yes | **单段**；按 `reveal` 显字 |
| `reveal` | yes | `word`（以空格分词，适合英混）\| `char`（**中文密排优先**） |
| `framesPerStep` | no | 每步间隔帧，默认 `word`≈5、`char`≈2 @30fps |
| `textStartFrame` | no | 正文从第几帧起打，默认有标题 18 否则 0 |
| `outroFadeFrames` | no | 同左 |

**用途**：概念抽象、只好多字时，**打字机/逐字**，避免大段动效行墙（组会感）。

### `kind: "kineticText"`（多行动效字）

**原则**：动效、叙事弧、高亮词须**由文案与分镜在故事里的作用**反推，**不得**为炫技而堆动画。在 **Delivery style** 为演讲/组会/高信息跟读时，`kineticText` 常是**合适的主选**；若为**科普向**且未指定他种风格，默认定式见 `remo-agent-video-plan` 的 **Delivery style**（Heuristic）。详见 *Core principles (motion & narrative)*。

| Field | Required | Notes |
|-------|----------|--------|
| `title` | no | 可选；先于正文入场 |
| `lines` | yes (非空) | 字符串数组，每行独立动画 |
| `lineAnimation` | 条件 | 与 `contentArc` 二选一；若都写，**以 `contentArc` 为准**（见 `src/lib/kineticArc.ts`） |
| `contentArc` | 条件 | `setup` \| `pressure` \| `mechanism` \| `dialectic` \| `metaphor` \| `application` \| `closing`；驱动默认 `lineAnimation` 与 `staggerFrames` |
| `showSemanticIcons` | no | 默认 `true`；`highlights` 中匹配到的词前显示语义小图标（论文/经费等，见 `src/lib/semanticIcons.tsx`） |
| `staggerFrames` | no | 行与行（或字与字）开隔帧数；未写时用当前 `contentArc` 的缺省；`wordStagger` 会略缩短 |
| `highlights` | no | 与 `bullets` 相同，关键词高亮 |
| `outroFadeFrames` | no | 片尾渐隐长度，接下一镜更顺 |

- `mechanism` 且**恰好三行**时：横向**机制链**（三卡 + 箭头 + 分步入场），卡片用大图标、正文不重复行内小图标。  
- `dialectic` 且为 `collide`：除行内高亮外，对撞**两列上方**再显示与该行语义相关的大一丢图标。  
- `collide`：两行成一对，左右对撞进中间；行数为偶数时成对多；奇数时最后一行单独入。
