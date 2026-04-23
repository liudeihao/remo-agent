/**
 * Sidecar metadata for a video project directory (`projects/<slug>/`).
 * Not read by Remotion; use for publishing (title/description), agents, and humans.
 * The rendered props file is always `plan.json` (see `VideoPlanProps`).
 *
 * `title` and `description` are free-form text for the target audience (e.g. Chinese
 * for 中文 platform titles/简介, English for global uploads). They are not parsed by Remotion;
 * JSON field names stay English for tooling.
 */
export type VideoProjectMeta = {
  /** Display / platform title (e.g. B 站/YouTube 展示标题；常写中文) */
  title: string;
  /** Longer description, show notes, or upload body text (e.g. 视频简介/摘要；常写中文) */
  description: string;
  /** Should match the parent directory name: `projects/<slug>/` */
  slug: string;
};
