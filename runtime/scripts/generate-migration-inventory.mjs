#!/usr/bin/env node

import { readdir, stat, writeFile } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(process.cwd());
const v2Root = resolve(root, "systems-hub-os-v2");
const outputCsv = resolve(v2Root, "migration/inventory.csv");
const outputSummary = resolve(v2Root, "migration/inventory-summary.md");

const excludedDirectories = new Set([".git", "systems-hub-os-v2"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name) && directory === root) continue;
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }

  return files;
}

function normalize(path) {
  return relative(root, path).split(sep).join("/");
}

function classify(path) {
  if (path === ".DS_Store" || path.endsWith("/.DS_Store") || path.includes("/~$")) {
    return ["delete-review", "restricted", "", "OS metadata or temporary lock file"];
  }
  if (path.endsWith(".env") || path.includes(".env.") || path.endsWith("/.env.local")) {
    return ["private", "secret", "", "Credential file; never migrate into model-readable storage"];
  }
  if (path.startsWith("tmp/")) {
    return ["generated", "restricted", "", "Temporary media or processing output"];
  }
  if (path.startsWith("exports/")) {
    return ["generated", "internal", "external-artifact-storage/", "Published/deliverable artifact, not canonical knowledge"];
  }
  if (path.startsWith("finance/")) {
    return ["private", "private", "restricted-finance-store/", "Raw accounting data requires separate access control"];
  }
  if (path.startsWith(".codex/agents/")) {
    return ["adapter", "internal", "runtime/adapters/codex/", "Regenerate from canonical role definition"];
  }
  if (path.startsWith(".claude/agents/")) {
    return ["consolidate", "internal", "agents/roles/", "Legacy role source; rewrite provider-neutrally"];
  }
  if (path.startsWith(".claude/rules/")) {
    return ["consolidate", "internal", "governance/", "Legacy governance source"];
  }
  if (path.startsWith(".claude/") || path.startsWith(".agents/")) {
    return ["adapter", "internal", "runtime/adapters/", "Platform-specific config or skill source"];
  }
  if (["AGENTS.md", "CLAUDE.md", "TEAM.md"].includes(path)) {
    return ["consolidate", "internal", path === "AGENTS.md" ? "AGENTS.md" : "agents/", "Overlapping entrypoint, roster, or platform guidance"];
  }
  if (path === "CLAUDE.local.md") {
    return ["private", "private", "", "Local-only instructions"];
  }
  if (path === ".gitignore") {
    return ["keep-legacy", "public", ".gitignore", "Legacy repository hygiene; v2 has its own policy"];
  }
  if (path.startsWith("decisions/")) {
    return ["migrate", "internal", "operations/decisions/", "Canonical decision history"];
  }
  if (path.startsWith("tools/harness/")) {
    return ["consolidate", "internal", "runtime/scripts/", "Legacy runtime script; review and port selectively"];
  }
  if (path.startsWith("projects/")) {
    return ["consolidate", "internal", "projects/", "Legacy project stub; reconcile with project registry and manifest"];
  }
  if (path.startsWith("references/")) {
    return ["migrate", "internal", "knowledge/references/", "Reusable reference material"];
  }
  if (path.startsWith("templates/")) {
    return ["migrate", "internal", "knowledge/shared/templates/", "Reusable template"];
  }
  if (path.startsWith("archives/")) {
    return ["archive", "internal", "archive/", "Historical material"];
  }
  if (path.startsWith("wiki/marco/profile") || path.startsWith("wiki/marco/goals") ||
      path.startsWith("wiki/marco/operating-model") || path.startsWith("wiki/marco/weekly-reviews")) {
    return ["private", "private", "restricted-personal-store/", "Personal context requires separate access control"];
  }
  if (path === "wiki/marco/preferences.md" || path === "wiki/marco/current-priorities.md") {
    return ["consolidate", "private", "company/operations/", "Create minimal business-safe extracts and keep raw personal context restricted"];
  }
  if (path.startsWith("wiki/people/")) {
    return ["private", "private", "restricted-relationship-store/", "Prospect and relationship data"];
  }
  if (path.startsWith("wiki/routing/")) {
    return ["consolidate", "internal", "agents/", "Merge routing into canonical registries"];
  }
  if (path.startsWith("wiki/risks/")) {
    return ["migrate", "internal", "company/operations/risks/", "Current company risk register"];
  }
  if (path.startsWith("wiki/traders-hub/")) {
    return ["consolidate", "internal", "projects/traders-hub/knowledge/", "Merge product knowledge into one project package"];
  }
  if (path.startsWith("wiki/playbooks/")) {
    return ["consolidate", "internal", "knowledge/shared/", "Review for reusable capability knowledge"];
  }
  if (path.startsWith("wiki/systems-hub/operations/harness/runs/")) {
    return ["archive", "internal", "operations/runs/", "Historical execution evidence"];
  }
  if (path.startsWith("wiki/systems-hub/operations/harness/core/")) {
    return ["consolidate", "internal", "governance/", "Legacy harness core; reconcile with v2 governance"];
  }
  if (path.startsWith("wiki/systems-hub/operations/harness/capabilities/")) {
    return ["consolidate", "internal", "capabilities/", "Reusable capability source"];
  }
  if (path.startsWith("wiki/systems-hub/operations/harness/projects/traders-hub/")) {
    return ["consolidate", "internal", "projects/traders-hub/", "Project workflow source"];
  }
  if (path.startsWith("wiki/systems-hub/operations/harness/company/")) {
    return ["consolidate", "internal", "company/operations/", "Company operating source"];
  }
  if (path.startsWith("wiki/systems-hub/operations/harness/")) {
    return ["consolidate", "internal", "governance/", "Legacy harness index or control source"];
  }
  if (path.startsWith("wiki/systems-hub/okrs/")) {
    return ["migrate", "internal", "company/okrs/", "Company objectives"];
  }
  if (path.startsWith("wiki/systems-hub/launch/")) {
    return ["consolidate", "internal", "projects/traders-hub/reports/", "Temporary project launch war room"];
  }
  if (path.startsWith("wiki/systems-hub/legal/")) {
    return ["consolidate", "protected", "projects/traders-hub/security/legal/", "Protected legal/product material"];
  }
  if (path.startsWith("wiki/systems-hub/finance/")) {
    return ["consolidate", "private", "capabilities/finance/", "Finance process may migrate; raw values remain restricted"];
  }
  if (path.startsWith("wiki/systems-hub/marketing/queue/") ||
      path.startsWith("wiki/systems-hub/marketing/reports/")) {
    return ["archive", "internal", "operations/reports/content/", "Dated output; not shared capability truth"];
  }
  if (path.startsWith("wiki/systems-hub/marketing/")) {
    return ["consolidate", "internal", "capabilities/marketing/", "Marketing or content capability source"];
  }
  if (path.startsWith("wiki/systems-hub/competition/")) {
    return ["consolidate", "internal", "capabilities/research/", "Market research capability source"];
  }
  if (path.startsWith("wiki/systems-hub/")) {
    return ["consolidate", "internal", "company/", "Company knowledge source"];
  }
  if (path.startsWith("wiki/")) {
    return ["consolidate", "internal", "knowledge/", "Unclassified wiki source; manual review required"];
  }
  return ["keep-legacy", "internal", "", "Manual review required"];
}

function csvCell(value) {
  const string = String(value ?? "");
  return `"${string.replaceAll("\"", "\"\"")}"`;
}

const trackedOutput = spawnSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" });
const tracked = new Set((trackedOutput.stdout || "").split("\0").filter(Boolean));
const files = (await walk(root)).map(path => ({ absolute: path, path: normalize(path) }));
const rows = [];

for (const file of files.sort((a, b) => a.path.localeCompare(b.path))) {
  const info = await stat(file.absolute);
  const [action, dataClass, target, reason] = classify(file.path);
  rows.push({
    source: file.path,
    action,
    dataClass,
    target,
    tracked: tracked.has(file.path) ? "yes" : "no",
    bytes: info.size,
    reason,
  });
}

const headers = ["source", "action", "data_class", "target", "git_tracked", "bytes", "reason"];
const csv = [
  headers.map(csvCell).join(","),
  ...rows.map(row => [
    row.source,
    row.action,
    row.dataClass,
    row.target,
    row.tracked,
    row.bytes,
    row.reason,
  ].map(csvCell).join(",")),
].join("\n");

const byAction = new Map();
const byDataClass = new Map();
for (const row of rows) {
  byAction.set(row.action, (byAction.get(row.action) || 0) + 1);
  byDataClass.set(row.dataClass, (byDataClass.get(row.dataClass) || 0) + 1);
}

const summary = [
  "# Legacy Migration Inventory Summary",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Files inventoried: ${rows.length}`,
  "",
  "## By Action",
  "",
  "| Action | Files |",
  "|---|---:|",
  ...[...byAction.entries()].sort().map(([key, value]) => `| ${key} | ${value} |`),
  "",
  "## By Data Class",
  "",
  "| Data Class | Files |",
  "|---|---:|",
  ...[...byDataClass.entries()].sort().map(([key, value]) => `| ${key} | ${value} |`),
  "",
  "## Review Order",
  "",
  "1. Secret and private classifications",
  "2. Governance and agent consolidations",
  "3. Trader's Hub project consolidation",
  "4. Company and capability knowledge",
  "5. Runtime scripts and provider adapters",
  "6. Historical archive",
  "7. Generated and delete-review material",
  "",
  "This inventory records metadata and proposed handling. It does not move, delete, or inspect file contents.",
  "",
].join("\n");

await writeFile(outputCsv, `${csv}\n`);
await writeFile(outputSummary, summary);

console.log(`Inventoried ${rows.length} files`);
console.log(`CSV: ${outputCsv}`);
console.log(`Summary: ${outputSummary}`);
