# remo-agent

把 **结构化视频计划**（JSON）用 Remotion 渲染成 **可批量复用的 1920×1080 视频**：封面、要点、配图、代码块；可选整段旁白音频。本仓库的 **视频计划（VideoPlan）** 是通用数据模型，不限于「情报简报」；Agent 在合适场景下通过项目内 **Cursor skills**（`.cursor/skills/`）自主使用「写稿 →（外置 TTS）→ 出片」流程。

## 前置

- Node 18+（已用 Node 22 做类型与脚本验证）
- 首次 `render` / studio 会下载 **Chrome Headless Shell**（约百兆），需能访问外网；会缓存

## 命令

```powershell
cd remo-agent
npm install
npm run dev
```

在 Studio 里选 **VideoFromPlan**，用默认 props 或从文件加载 props。

无头出片（示例 props）：

```powershell
npm run render
```

自定义 JSON：

```powershell
npx remotion render src/index.ts VideoFromPlan out/my-video.mp4 --props=path\to\plan.json
```

### 按项目目录出片（推荐）

每个视频使用独立目录 `projects/<slug>/`，包含**标题/描述**（`meta.json`）、**Remotion props**（`plan.json`）、以及成片 **`out/video.mp4`**。约定见 `projects/README.md`。

```powershell
npm run render:project -- my-video-slug
```

## JSON / 类型约定

- 主类型：`VideoPlanProps`（`src/types/videoPlan.ts`）。
- 顶层：`fps`、`width`、`height`（可选）、`slides[]`、可选 `narrationAudioUrl`（整段旁白，HTTPS 或 `file:`）。
- 每页 `slide`：必有 `kind`、`durationInFrames`；可选 `ttsText`（给上游 TTS 用，成片可不内嵌 TTS）。
- `kind`：`cover` | `bullets` | `media` | `code` | `rampBounce`（字段见类型与 `slideRegistry` 中的 `SLIDE_CATALOG`）。

示例：`data/sample-video-plan.json`。

- 平台用**标题/长描述**：放在 `projects/<slug>/meta.json`（类型 `VideoProjectMeta`），**不**传给 Remotion；`title` / `description` 的**正文语言**按发布场景书写（**中文标题 + 中文简介**为国内默认），键名仍为英文。成片元数据与 `plan.json` 分离，避免和某页 `title` 混淆。

## Remotion 扩展方式（通用、可复用）

1. 在 `src/types/videoPlan.ts` 的联合类型中增加新 `kind` 与字段。
2. 新增 `src/components/*SlideView.tsx`，从 `src/components/index.ts` 导出。
3. 在 `src/slideRegistry.tsx` 的 `SLIDE_CATALOG` 与 `renderSlideContent` 中登记（否则 TypeScript 在 `assertNever` 处报错）。

同一套组件可被多个 Composition 复用；当前主 Composition 为 `VideoFromPlan`。

## Agent skills

本仓库在 `.cursor/skills/` 下提供项目级 **Agent Skills**（主文件 `SKILL.md` + 各包内 `references/*.md` 细表，风格对齐常见开源 skill 仓库的分层写法），对应「文案数据 → 组件/注册表 → 出片 → 旁白 handoff」：

- `remo-agent-video-plan` — `VideoPlanProps` JSON、字段与 `kind` 选用
- `remo-agent-slide-components` — `*SlideView`、`slideRegistry`、`SLIDE_CATALOG` 扩展
- `remo-agent-remotion-render` — Remotion Studio、`remotion render`、MP4
- `remo-agent-narration-tts` — `ttsText` / 混音后 `narrationAudioUrl` 的约定与保密边界

## 目录

- `src/compositions/VideoFromPlan.tsx` — 主 Composition（按 `Sequence` 拼页 + 可选整轨 `Audio`）
- `src/slideRegistry.tsx` — 幻灯片索引（`SLIDE_CATALOG`）与 `renderSlideContent`
- `src/components/*` — 各页视觉与 `index.ts` 总导出
- `data/sample-video-plan.json` — 可渲染的完整示例
- `projects/README.md` — 每视频一个 `projects/<slug>/` 目录约定
- `projects/example-hello/` — 最小示例（`meta.json` + `plan.json`）

## 与上游「文案 / TTS」的衔接

1. Agent 或脚本产出符合 `VideoPlanProps` 的 JSON。
2. 在片外对每页 `ttsText` 做 TTS，混成单文件后把 URL 写入 `narrationAudioUrl`，再 `remotion render`。
3. 分发、上传、密钥不放在本仓库。
