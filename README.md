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

## JSON / 类型约定

- 主类型：`VideoPlanProps`（`src/types/videoPlan.ts`）。
- 顶层：`fps`、`width`、`height`（可选）、`slides[]`、可选 `narrationAudioUrl`（整段旁白，HTTPS 或 `file:`）。
- 每页 `slide`：必有 `kind`、`durationInFrames`；可选 `ttsText`（给上游 TTS 用，成片可不内嵌 TTS）。
- `kind`：`cover` | `bullets` | `media` | `code`（字段见类型）。

示例：`data/sample-video-plan.json`。

## Remotion 扩展方式（通用、可复用）

1. 在 `src/types/videoPlan.ts` 的联合类型中增加新 `kind` 与字段。
2. 新增 `src/components/*SlideView.tsx`，从 `src/components/index.ts` 导出。
3. 在 `src/slideRegistry.tsx` 的 `SLIDE_CATALOG` 与 `renderSlideContent` 中登记（否则 TypeScript 在 `assertNever` 处报错）。

同一套组件可被多个 Composition 复用；当前主 Composition 为 `VideoFromPlan`。

## Agent skills

本仓库在 `.cursor/skills/` 下提供项目级 **Agent Skills**（`SKILL.md`），便于在「需要出片 / 需要旁白 / 需要符合 schema 的 JSON」时自动套用：

- `remo-agent-video-plan` — 视频计划 JSON 与字段说明
- `remo-agent-remotion-render` — 本地 `remotion` 渲染与 Studio
- `remo-agent-narration-tts` — `ttsText` 与 `narrationAudioUrl` 的衔接方式

## 目录

- `src/compositions/VideoFromPlan.tsx` — 主 Composition（按 `Sequence` 拼页 + 可选整轨 `Audio`）
- `src/slideRegistry.tsx` — 幻灯片索引（`SLIDE_CATALOG`）与 `renderSlideContent`
- `src/components/*` — 各页视觉与 `index.ts` 总导出
- `data/sample-video-plan.json` — 可渲染的完整示例

## 与上游「文案 / TTS」的衔接

1. Agent 或脚本产出符合 `VideoPlanProps` 的 JSON。
2. 在片外对每页 `ttsText` 做 TTS，混成单文件后把 URL 写入 `narrationAudioUrl`，再 `remotion render`。
3. 分发、上传、密钥不放在本仓库。
