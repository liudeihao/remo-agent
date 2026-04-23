# Video projects (per-run directories)

每个视频（或一次制作）使用 **一个子目录** `projects/<slug>/`，把**成片以外的交付物**和 Remotion 的 props 收拢在一起。`<slug>` 用短横线连接的小写标识（kebab-case），例如 `weekly-brief-2026-04-23` 或 `product-intro-q2`。

## 布局


| Path            | 用途                                                             |
| --------------- | -------------------------------------------------------------- |
| `meta.json`     | 成片**标题**、**长描述**（上传平台、归档）；**不**传给 Remotion。                    |
| `plan.json`     | **唯一**送给 `VideoFromPlan` 的 `VideoPlanProps`（`--props=...`）。    |
| `out/video.mp4` | 默认**成片输出**；由 `npm run render:project -- <slug>` 创建 `out/` 并写入。 |
| 其他              | 可放 TTS 中间文件、旁白 `wav`、封面图、**notes.md** 等；命名自定，但勿与下两项冲突。         |


## 理念：写 `plan.json` 时别保守

本仓 Remotion 成片的**默认**是 **动效足、时间够、少做成静态串页念稿**；除非发布方/作者**明确要求**「极简、组会、几乎不动」。

- **多**用会随时间变样的 `kind`（如 `explainerGraph`、`kineticText` 且填好弧与 stagger、`media` 等），**少**用纯列表体搪塞整支片子。
- 每镜给足 **`durationInFrames`**，让弹簧、画线、分步入场**看得完**；过短＝动效被切成闪光。
- 画面仍呆板、缺少动效与镜头语言时，除改 `plan` 外，要检查 `*SlideView` 的**尺寸与持续运动**（见 **`.cursor/skills/remo-agent-motion-views/SKILL.md` v0.5+**）。

与根目录 `README.md` 的 **「理念：激进动效」** 同一条线。

## 类型与语言

- `meta.json` 的 TypeScript 类型为 `VideoProjectMeta`（见 `src/types/videoProjectMeta.ts`）。
- `**title` / `description` 的文案语言**：与 Remotion/代码无关，按**发布平台与观众**书写即可；在中文场景下应同时产出 **中文视频标题** 与 **中文简介**（或中英双语，由你方规范）。JSON 的**键名**仍为英文，便于程序读取。
- `**slug`**：目录名，建议仍用 `kebab-case` **ASCII**（如 `my-topic`），避免部分工具对路径字符的限制。

## Agent / Skill

- 在 `remo-agent-video-plan` 与 `references/project-layout.md` 中约定：新建 `projects/<slug>/` 时，应**写入或更新** `meta.json` 的 `title`、`description`（与 `plan.json` 同步交付）；若用户语言为中文，**默认**填写中文标题与简介。

## 渲染

在仓库根目录执行：

```powershell
npm run render:project -- <slug>
```

会读取 `projects/<slug>/plan.json` 并输出到 `projects/<slug>/out/video.mp4`。

`out/` 目录默认**不提交**到 Git（见根目录 `.gitignore`）。

## 与 `data/` 的关系

- `data/sample-video-plan.json` 保留为**全仓库**快速示例、CI 与 `npm run render`（根目录 `out/video.mp4`）对照用。
- **正式成片**、多轮迭代、要附带标题/描述/附件时，用 `**projects/<slug>/`**。

