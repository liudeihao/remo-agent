/**
 * Renders a single project: projects/<slug>/plan.json -> projects/<slug>/out/video.mp4
 * Usage: node scripts/render-project.mjs <slug>
 *   or: npm run render:project -- <slug>
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const slug = process.argv[2];

if (!slug || slug.startsWith("-")) {
  console.error("Usage: node scripts/render-project.mjs <project-slug>");
  process.exit(1);
}

const projectDir = join(root, "projects", slug);
const planPath = join(projectDir, "plan.json");
if (!existsSync(planPath)) {
  console.error(`Missing plan file: ${planPath}`);
  process.exit(1);
}

const outDir = join(projectDir, "out");
mkdirSync(outDir, { recursive: true });
const outVideo = join(outDir, "video.mp4");

const result = spawnSync(
  "npx",
  ["remotion", "render", "src/index.ts", "VideoFromPlan", outVideo, "--props", planPath],
  { cwd: root, stdio: "inherit", shell: true, env: process.env },
);

process.exit(result.status === null ? 1 : result.status);
