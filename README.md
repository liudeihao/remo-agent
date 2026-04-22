# intel-brief-video

把 **AI 清洗后的结构化简报**（JSON）渲染成 **1920×1080 情报视频**：封面、要点、配图、代码片段；可选整轨旁白音频。与桌面上的 `content-pipeline-mvp`（文案/元数据批处理）互补：那边产出文字资产，这里产出视频资产。

## 前置

- Node 18+（当前环境已用 Node 22 验证类型检查）
- 首次 `render` / `compositions` 会下载 **Chrome Headless Shell**（约百兆），需能访问外网；下载完成后会缓存，后续更快。

## 命令

```powershell
cd intel-brief-video
npm install
npm run dev
```

Studio 里选 **IntelBrief**，用默认 props 或从文件加载 props 预览。

无头出片（示例 props）：

```powershell
npm run render
```

自定义 JSON：

```powershell
npx remotion render src/index.ts IntelBrief out/my-brief.mp4 --props=path\to\brief.json
```

## JSON 约定

类型定义见 `src/types/brief.ts`。最小结构：

- 顶层：`fps`、`width`、`height`（可选）、`slides[]`、可选 `narrationAudioUrl`（整段旁白，HTTPS 或本地文件 URL）。
- 每页 `slide`：必有 `kind`、`durationInFrames`；可选 `ttsText`（给上游 TTS 用，成片可不处理）。
- `kind`：`cover` | `bullets` | `media` | `code`（各字段见类型）。

示例数据：`data/sample-brief.json`。

## 与「抓取 → 总结」流水线怎么接

1. Agent 输出符合上述类型的 JSON（或先写入 `out/brief-2026-04-22.json`）。
2. 定时任务调用 `remotion render ... --props=...` 得到 MP4。
3. TTS：用各 slide 的 `ttsText` 在片外合成一条音轨，把最终 URL 填进 `narrationAudioUrl` 再渲染；或后续改为按 Sequence 分段 `Audio`（可再迭代）。
4. 分发：沿用各平台开放接口/工具；本仓库不内置上传密钥。

## 目录

- `src/compositions/IntelBrief.tsx` — 主 Composition，按 `Sequence` 拼页。
- `src/components/*` — 各页视觉。
- `data/sample-brief.json` — 可渲染的完整示例。
