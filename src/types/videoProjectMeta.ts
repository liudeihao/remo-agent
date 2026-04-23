/**
 * Sidecar metadata for a video project directory (`projects/<slug>/`).
 * Not read by Remotion; use for publishing (title/description), agents, and humans.
 * The rendered props file is always `plan.json` (see `VideoPlanProps`).
 */
export type VideoProjectMeta = {
  /** Display / platform title (e.g. YouTube, Bilibili) */
  title: string;
  /** Longer description, show notes, or upload body text */
  description: string;
  /** Should match the parent directory name: `projects/<slug>/` */
  slug: string;
};
