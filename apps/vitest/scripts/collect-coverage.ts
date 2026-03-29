import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../../..");
const OUTPUT_DIR = resolve(import.meta.dirname, "../coverage");

const SEARCH_DIRS = [
  "apps/web",
  "packages/pages",
  "packages/widgets",
  "packages/features",
  "packages/entities",
  "packages/shared",
];

const COVERAGE_FILES = ["coverage-summary.json", "coverage-final.json"];

type Metric = { total: number; covered: number; skipped: number; pct: number };
type MetricKey = "lines" | "statements" | "functions" | "branches";

const METRIC_KEYS: MetricKey[] = [
  "lines",
  "statements",
  "functions",
  "branches",
];

/** Recalculate total from all file entries in the merged summary. */
function recalculateTotal(
  merged: Record<string, Record<string, Metric>>,
): Record<string, Metric> {
  const result: Record<string, Metric> = {};

  for (const key of METRIC_KEYS) {
    let totalSum = 0;
    let coveredSum = 0;
    let skippedSum = 0;

    for (const [filePath, fileMetrics] of Object.entries(merged)) {
      if (filePath === "total") continue;
      const m = fileMetrics[key];
      if (!m) continue;
      totalSum += m.total;
      coveredSum += m.covered;
      skippedSum += m.skipped;
    }

    result[key] = {
      total: totalSum,
      covered: coveredSum,
      skipped: skippedSum,
      pct:
        totalSum === 0
          ? 100
          : Math.round((coveredSum / totalSum) * 10000) / 100,
    };
  }

  return result;
}

if (existsSync(OUTPUT_DIR)) {
  rmSync(OUTPUT_DIR, { recursive: true });
}
mkdirSync(OUTPUT_DIR, { recursive: true });

const summaries: Record<string, unknown>[] = [];
const finals: Record<string, unknown>[] = [];
let collected = 0;

function collectFromDir(dir: string, pkgName: string) {
  const coverageDir = join(dir, "coverage");
  const summaryPath = join(coverageDir, "coverage-summary.json");
  if (!existsSync(summaryPath)) return;

  collected++;
  console.log(`  Found: ${coverageDir} (${pkgName})`);

  for (const file of COVERAGE_FILES) {
    const src = join(coverageDir, file);
    if (!existsSync(src)) continue;

    const content = JSON.parse(readFileSync(src, "utf-8"));
    if (file === "coverage-summary.json") {
      summaries.push(content);
    } else {
      finals.push(content);
    }
  }
}

for (const searchDir of SEARCH_DIRS) {
  const absDir = join(ROOT, searchDir);
  if (!existsSync(absDir)) continue;

  const isApp = searchDir.startsWith("apps/");

  if (isApp) {
    collectFromDir(absDir, basename(absDir));
  } else {
    const entries = readdirSync(absDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      collectFromDir(join(absDir, entry.name), entry.name);
    }
  }
}

if (collected === 0) {
  console.log("\nNo coverage reports found.");
  // Write empty files so CI action doesn't fail
  writeFileSync(
    join(OUTPUT_DIR, "coverage-summary.json"),
    JSON.stringify({ total: {} }),
  );
  writeFileSync(join(OUTPUT_DIR, "coverage-final.json"), JSON.stringify({}));
} else if (collected === 1) {
  // Single package — copy directly
  if (summaries[0]) {
    writeFileSync(
      join(OUTPUT_DIR, "coverage-summary.json"),
      JSON.stringify(summaries[0], null, 2),
    );
  }
  if (finals[0]) {
    writeFileSync(
      join(OUTPUT_DIR, "coverage-final.json"),
      JSON.stringify(finals[0], null, 2),
    );
  }
} else {
  // Multiple packages — merge coverage-final (union of all file entries)
  const mergedFinal: Record<string, unknown> = {};
  for (const f of finals) {
    Object.assign(mergedFinal, f);
  }
  writeFileSync(
    join(OUTPUT_DIR, "coverage-final.json"),
    JSON.stringify(mergedFinal, null, 2),
  );

  // Merge coverage-summary (union of all file entries, then recalculate total)
  const mergedSummary: Record<string, unknown> = {};
  for (const s of summaries) {
    for (const [key, value] of Object.entries(s)) {
      if (key !== "total") {
        mergedSummary[key] = value;
      }
    }
  }
  // Recalculate total from all merged file entries
  mergedSummary.total = recalculateTotal(
    mergedSummary as Record<string, Record<string, Metric>>,
  );
  writeFileSync(
    join(OUTPUT_DIR, "coverage-summary.json"),
    JSON.stringify(mergedSummary, null, 2),
  );
}

console.log(
  `\nCollected coverage from ${collected} package(s) into ${OUTPUT_DIR}`,
);
