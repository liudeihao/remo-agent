# Video plan: slide kinds and fields

**Normative source**: `src/types/videoPlan.ts`. This file is a readable mirror for agents; on conflict, the TypeScript types win.

## Common fields (all kinds)

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `kind` | string (discriminant) | yes | One of: `cover`, `bullets`, `media`, `code`, `kineticText` |
| `durationInFrames` | number | yes | Integer ≥ 1. Total duration = sum over `slides` |
| `ttsText` | string | no | Spoken script for external TTS; not rendered on screen |

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

### `kind: "kineticText"`（科普/动效字）

**原则**：动效、叙事弧、高亮词须**由文案与分镜在故事里的作用**反推，**不得**为炫技而堆动画。详见本仓库 `remo-agent-video-plan` Skill 中的 *Core principles (motion & narrative)*。

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
