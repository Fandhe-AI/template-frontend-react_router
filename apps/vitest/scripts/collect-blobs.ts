import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../../..");
const OUTPUT_DIR = resolve(import.meta.dirname, "../blob-inputs");

const SEARCH_DIRS = [
  "apps/web",
  "packages/pages",
  "packages/widgets",
  "packages/features",
  "packages/entities",
  "packages/shared",
];

if (existsSync(OUTPUT_DIR)) {
  rmSync(OUTPUT_DIR, { recursive: true });
}
mkdirSync(OUTPUT_DIR, { recursive: true });

let collected = 0;

for (const searchDir of SEARCH_DIRS) {
  const absDir = join(ROOT, searchDir);
  if (!existsSync(absDir)) continue;

  const isApp = searchDir.startsWith("apps/");

  if (isApp) {
    const blobPath = join(absDir, "test-results", "results.blob");
    if (existsSync(blobPath)) {
      const pkgName = basename(absDir);
      const dest = join(OUTPUT_DIR, `${pkgName}.blob`);
      cpSync(blobPath, dest);
      collected++;
      console.log(`  Collected: ${blobPath} -> ${dest}`);
    }
  } else {
    const entries = readdirSync(absDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const blobPath = join(absDir, entry.name, "test-results", "results.blob");
      if (existsSync(blobPath)) {
        const dest = join(OUTPUT_DIR, `${entry.name}.blob`);
        cpSync(blobPath, dest);
        collected++;
        console.log(`  Collected: ${blobPath} -> ${dest}`);
      }
    }
  }
}

console.log(`\nCollected ${collected} blob file(s) into ${OUTPUT_DIR}`);
