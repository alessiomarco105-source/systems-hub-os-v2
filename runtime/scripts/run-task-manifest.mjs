#!/usr/bin/env node

import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { basename, dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(scriptPath), "../..");
const launcher = resolve(repoRoot, "runtime/scripts/pi-restricted-launcher.sh");

function fail(message) {
  throw new Error(message);
}

function assertObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${name} must be an object`);
}

function assertExactKeys(object, allowed, name) {
  for (const key of Object.keys(object)) {
    if (!allowed.includes(key)) fail(`${name} contains unsupported field: ${key}`);
  }
}

function assertString(value, name) {
  if (typeof value !== "string" || value.length === 0) fail(`${name} must be a non-empty string`);
}

function assertBoolean(value, expected, name) {
  if (value !== expected) fail(`${name} must be ${expected}`);
}

function assertPositiveNumber(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    fail(`${name} must be a positive number`);
  }
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) fail(`${name} must be a positive integer`);
}

function assertStringArray(value, name, { min = 0, unique = false } = {}) {
  if (!Array.isArray(value) || value.length < min || value.some(item => typeof item !== "string" || !item)) {
    fail(`${name} must be an array of non-empty strings`);
  }
  if (unique && new Set(value).size !== value.length) fail(`${name} must contain unique values`);
}

function safeRelativePath(path) {
  return path &&
    !path.startsWith("/") &&
    !path.split(/[\\/]/).includes("..") &&
    !/(^|\/)\.env($|\.)/i.test(path) &&
    !/(secret|credential)/i.test(path) &&
    !/\.(pem|key)$/i.test(path);
}

function extractDataClass(text, path) {
  const frontmatter = text.startsWith("---") ? text.split("---", 3)[1] : "";
  const match = frontmatter.match(/^data_class:\s*([a-z-]+)\s*$/m);
  if (!match) fail(`context file is missing data_class metadata: ${path}`);
  return match[1];
}

function validateManifest(manifest) {
  assertObject(manifest, "manifest");
  assertExactKeys(manifest, [
    "schema", "task_id", "task_kind", "execution_status", "role", "scope",
    "provider", "model", "source_root", "context", "permissions", "budget",
    "prompt", "output", "validation", "review"
  ], "manifest");

  if (manifest.schema !== "systems_hub.task_manifest/v1") fail("unsupported manifest schema");
  for (const field of [
    "task_id", "task_kind", "execution_status", "role", "scope",
    "provider", "model", "source_root", "prompt"
  ]) {
    assertString(manifest[field], field);
  }
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(manifest.task_id)) fail("invalid task_id");
  if (!["standard", "review"].includes(manifest.task_kind)) fail("invalid task_kind");
  if (!["manual", "draft"].includes(manifest.execution_status)) fail("invalid execution_status");
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(manifest.role)) fail("invalid role");
  if (!/^(company|personal|project:[a-z0-9-]+|capability:[a-z0-9-]+)$/.test(manifest.scope)) fail("invalid scope");
  if (manifest.provider !== "deepseek") fail("only deepseek is approved for this pilot");
  if (!["deepseek-v4-flash", "deepseek-v4-pro"].includes(manifest.model)) fail("model is not approved");
  if (manifest.source_root !== ".") fail("source_root must be repository root");
  if (manifest.prompt.length > 12000) fail("prompt exceeds 12000 characters");

  assertObject(manifest.context, "context");
  assertExactKeys(manifest.context, [
    "allowed_files", "allowed_data_classes", "max_files", "max_total_bytes"
  ], "context");
  assertStringArray(manifest.context.allowed_files, "context.allowed_files", { min: 1, unique: true });
  assertStringArray(manifest.context.allowed_data_classes, "context.allowed_data_classes", { min: 1, unique: true });
  assertPositiveInteger(manifest.context.max_files, "context.max_files");
  assertPositiveInteger(manifest.context.max_total_bytes, "context.max_total_bytes");
  if (manifest.context.max_files > 20) fail("context.max_files exceeds pilot maximum of 20");
  if (manifest.context.max_total_bytes > 1048576) fail("context.max_total_bytes exceeds pilot maximum of 1 MiB");
  if (manifest.context.allowed_files.length > manifest.context.max_files) fail("allowed file count exceeds max_files");
  for (const dataClass of manifest.context.allowed_data_classes) {
    if (!["public", "internal", "private", "protected"].includes(dataClass)) {
      fail(`unsupported data class: ${dataClass}`);
    }
    if (manifest.execution_status === "manual" && !["public", "internal"].includes(dataClass)) {
      fail(`data class requires a future explicit provider approval: ${dataClass}`);
    }
  }

  assertObject(manifest.permissions, "permissions");
  assertExactKeys(manifest.permissions, ["tools", "write", "external_actions"], "permissions");
  assertStringArray(manifest.permissions.tools, "permissions.tools", { unique: true });
  for (const tool of manifest.permissions.tools) {
    if (!["read", "grep", "find", "ls"].includes(tool)) fail(`tool is not read-only approved: ${tool}`);
  }
  assertBoolean(manifest.permissions.write, false, "permissions.write");
  assertBoolean(manifest.permissions.external_actions, false, "permissions.external_actions");

  assertObject(manifest.budget, "budget");
  assertExactKeys(manifest.budget, [
    "max_input_tokens", "max_output_tokens", "max_total_tokens", "max_cost_usd"
  ], "budget");
  assertPositiveInteger(manifest.budget.max_input_tokens, "budget.max_input_tokens");
  assertPositiveInteger(manifest.budget.max_output_tokens, "budget.max_output_tokens");
  assertPositiveInteger(manifest.budget.max_total_tokens, "budget.max_total_tokens");
  assertPositiveNumber(manifest.budget.max_cost_usd, "budget.max_cost_usd");
  if (manifest.budget.max_total_tokens < manifest.budget.max_input_tokens) {
    fail("max_total_tokens cannot be lower than max_input_tokens");
  }

  assertObject(manifest.output, "output");
  assertExactKeys(manifest.output, [
    "format", "max_words", "required_sections", "allow_preamble"
  ], "output");
  if (!["markdown", "json"].includes(manifest.output.format)) fail("unsupported output format");
  assertPositiveInteger(manifest.output.max_words, "output.max_words");
  assertStringArray(manifest.output.required_sections, "output.required_sections", { unique: true });
  if (typeof manifest.output.allow_preamble !== "boolean") {
    fail("output.allow_preamble must be boolean");
  }

  assertObject(manifest.validation, "validation");
  assertExactKeys(manifest.validation, [
    "forbidden_patterns", "required_patterns", "section_required_patterns",
    "require_evidence_labels"
  ], "validation");
  assertStringArray(manifest.validation.forbidden_patterns, "validation.forbidden_patterns");
  assertStringArray(manifest.validation.required_patterns, "validation.required_patterns");
  assertObject(manifest.validation.section_required_patterns, "validation.section_required_patterns");
  if (typeof manifest.validation.require_evidence_labels !== "boolean") {
    fail("validation.require_evidence_labels must be boolean");
  }
  const sectionPatterns = [];
  for (const [section, patterns] of Object.entries(manifest.validation.section_required_patterns)) {
    if (!manifest.output.required_sections.includes(section)) {
      fail(`section validation references an undeclared section: ${section}`);
    }
    assertStringArray(patterns, `validation.section_required_patterns.${section}`, { min: 1 });
    sectionPatterns.push(...patterns);
  }
  for (const pattern of [
    ...manifest.validation.forbidden_patterns,
    ...manifest.validation.required_patterns,
    ...sectionPatterns
  ]) {
    try {
      new RegExp(pattern, "i");
    } catch {
      fail(`invalid validation regex: ${pattern}`);
    }
  }

  if (manifest.task_kind === "review") {
    assertObject(manifest.review, "review");
    assertExactKeys(manifest.review, [
      "source_receipt", "required_worker_task_id", "require_worker_validation", "dimensions"
    ], "review");
    assertString(manifest.review.source_receipt, "review.source_receipt");
    assertString(manifest.review.required_worker_task_id, "review.required_worker_task_id");
    if (!["pass", "any"].includes(manifest.review.require_worker_validation)) {
      fail("review.require_worker_validation must be pass or any");
    }
    assertStringArray(manifest.review.dimensions, "review.dimensions", { min: 1, unique: true });
    const allowedDimensions = new Set([
      "factual-accuracy", "source-support", "priority-integrity", "scope-integrity",
      "missing-evidence", "risk-coverage", "decision-quality"
    ]);
    for (const dimension of manifest.review.dimensions) {
      if (!allowedDimensions.has(dimension)) fail(`unsupported review dimension: ${dimension}`);
    }
  } else if ("review" in manifest) {
    fail("standard tasks may not contain review configuration");
  }
}

async function validateReviewSource(manifest) {
  if (manifest.task_kind !== "review") return undefined;
  const receiptRelative = manifest.review.source_receipt;
  if (!safeRelativePath(receiptRelative) ||
      !receiptRelative.startsWith("operations/runs/usage/") ||
      !receiptRelative.endsWith(".json")) {
    fail("review source receipt must be a safe JSON path under operations/runs/usage");
  }
  const receiptAbsolute = resolve(repoRoot, receiptRelative);
  const receipt = JSON.parse(await readFile(receiptAbsolute, "utf8"));
  if (receipt.schema !== "systems_hub.run_receipt/v1") fail("review source has unsupported receipt schema");
  if (receipt.task_id !== manifest.review.required_worker_task_id) {
    fail(`review source worker task mismatch: ${receipt.task_id}`);
  }
  if (receipt.task_kind && receipt.task_kind !== "standard") {
    fail("review source must be a standard worker task");
  }
  if (manifest.review.require_worker_validation === "pass" &&
      receipt.validation?.status !== "pass") {
    fail("review source worker validation did not pass");
  }
  const outputRelative = receipt.output?.path;
  if (!safeRelativePath(outputRelative) ||
      !outputRelative.startsWith("operations/runs/usage/") ||
      !outputRelative.endsWith(".md")) {
    fail("review source output path is invalid");
  }
  const outputAbsolute = resolve(repoRoot, outputRelative);
  const output = await readFile(outputAbsolute);
  const actualHash = createHash("sha256").update(output).digest("hex");
  if (actualHash !== receipt.output.sha256) fail("review source output hash mismatch");
  const artifacts = [
    { path: receiptRelative, bytes: (await stat(receiptAbsolute)).size, dataClass: "internal" },
    { path: outputRelative, bytes: output.length, dataClass: "internal" }
  ];
  if (receipt.contract?.manifest_path) {
    const contractRelative = receipt.contract.manifest_path;
    if (!safeRelativePath(contractRelative) ||
        !contractRelative.startsWith("operations/runs/usage/") ||
        !contractRelative.endsWith(".manifest.json")) {
      fail("review source manifest snapshot path is invalid");
    }
    const contractAbsolute = resolve(repoRoot, contractRelative);
    const contractBytes = await readFile(contractAbsolute);
    const contractHash = createHash("sha256").update(contractBytes).digest("hex");
    if (contractHash !== receipt.contract.manifest_sha256) {
      fail("review source manifest snapshot hash mismatch");
    }
    const workerContract = JSON.parse(contractBytes.toString("utf8"));
    if (workerContract.task_id !== receipt.task_id) {
      fail("review source manifest task mismatch");
    }
    artifacts.push({
      path: contractRelative,
      bytes: contractBytes.length,
      dataClass: "internal"
    });
  }
  return {
    receipt,
    artifacts
  };
}

async function validateContext(manifest, reviewSource) {
  const rolePath = `agents/roles/${manifest.role}.md`;
  if (!manifest.context.allowed_files.includes(rolePath)) {
    fail(`selected role file must be included: ${rolePath}`);
  }

  let totalBytes = 0;
  const files = [];
  for (const path of manifest.context.allowed_files) {
    if (!safeRelativePath(path)) fail(`unsafe context path: ${path}`);
    const absolute = resolve(repoRoot, path);
    const repoRelative = relative(repoRoot, absolute);
    if (repoRelative.startsWith("..") || repoRelative.split(sep).includes("..")) {
      fail(`context path escapes repository: ${path}`);
    }
    const linkInfo = await lstat(absolute);
    if (linkInfo.isSymbolicLink()) fail(`context path may not be a symlink: ${path}`);
    const info = await stat(absolute);
    if (!info.isFile()) fail(`context path must be a regular file: ${path}`);
    const text = await readFile(absolute, "utf8");
    const dataClass = extractDataClass(text, path);
    if (!manifest.context.allowed_data_classes.includes(dataClass)) {
      fail(`context data class is not allowed: ${path} (${dataClass})`);
    }
    totalBytes += info.size;
    files.push({ path, bytes: info.size, dataClass });
  }
  for (const artifact of reviewSource?.artifacts || []) {
    if (files.some(file => file.path === artifact.path)) {
      fail(`review artifact is duplicated in allowed_files: ${artifact.path}`);
    }
    totalBytes += artifact.bytes;
    files.push(artifact);
  }
  if (files.length > manifest.context.max_files) {
    fail(`effective context file count ${files.length} exceeds limit ${manifest.context.max_files}`);
  }
  if (totalBytes > manifest.context.max_total_bytes) {
    fail(`context size ${totalBytes} exceeds limit ${manifest.context.max_total_bytes}`);
  }
  return { files, totalBytes };
}

function runLauncher(manifest, contextInfo) {
  const args = [
    "--source-root", repoRoot,
    "--model", manifest.model,
    "--tools", manifest.permissions.tools.join(","),
    "--thinking", "low",
    "--output-mode", "json",
    "--prompt", manifest.prompt
  ];
  for (const file of contextInfo.files) args.push("--allow-file", file.path);

  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(launcher, args, {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", chunk => { stdout += chunk; });
    child.stderr.on("data", chunk => { stderr += chunk; });
    child.on("error", rejectPromise);
    child.on("close", code => {
      if (code !== 0) rejectPromise(new Error(`launcher failed (${code}): ${stderr.trim()}`));
      else resolvePromise(stdout);
    });
  });
}

function extractAssistant(jsonl) {
  let assistant;
  for (const line of jsonl.split("\n").filter(Boolean)) {
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      fail("Pi emitted an invalid JSON event");
    }
    if (event.type === "message_end" && event.message?.role === "assistant") {
      assistant = event.message;
    }
  }
  if (!assistant) fail("Pi returned no completed assistant message");
  const text = (assistant.content || [])
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("\n")
    .trim();
  if (!text) fail("assistant output is empty");
  if (!assistant.usage) fail("assistant usage is missing");
  return { text, usage: assistant.usage, stopReason: assistant.stopReason };
}

function countWords(text) {
  return (text.match(/\S+/g) || []).length;
}

function extractSections(text, requiredSections) {
  const sections = new Map();
  const wanted = new Map(requiredSections.map(section => [section.toLowerCase(), section]));
  let current;
  for (const line of text.split("\n")) {
    const heading = line.match(/^#{1,6}\s*(?:\d+[.)]\s*)?(.+?)\s*$/);
    if (heading) {
      const normalized = heading[1].replace(/\*\*/g, "").trim().toLowerCase();
      current = wanted.get(normalized);
      if (current) sections.set(current, []);
      continue;
    }
    if (current) sections.get(current).push(line);
  }
  return new Map([...sections].map(([section, lines]) => [section, lines.join("\n").trim()]));
}

function validateOutput(manifest, result) {
  const checks = [];
  const failures = [];
  const text = result.text;
  const wordCount = countWords(text);
  const sections = extractSections(text, manifest.output.required_sections);

  checks.push(`output words: ${wordCount}/${manifest.output.max_words}`);
  if (wordCount > manifest.output.max_words) failures.push("output exceeds max_words");

  if (!manifest.output.allow_preamble && manifest.output.required_sections.length > 0) {
    const expectedStart = `## ${manifest.output.required_sections[0]}`;
    checks.push(`output starts with: ${expectedStart}`);
    if (!text.startsWith(expectedStart)) failures.push("output contains a preamble or wrong first section");
  }

  if (manifest.output.format === "json") {
    try {
      JSON.parse(text);
      checks.push("output is valid JSON");
    } catch {
      failures.push("output is not valid JSON");
    }
  }

  for (const section of manifest.output.required_sections) {
    const escapedSection = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const found = new RegExp(
      `(^|\\n)#{1,6}\\s*(?:\\d+[.)]\\s*)?${escapedSection}\\s*$`,
      "im"
    ).test(text);
    checks.push(`required section: ${section}`);
    if (!found) failures.push(`missing required section: ${section}`);
  }

  for (const [section, patterns] of Object.entries(manifest.validation.section_required_patterns)) {
    const sectionText = sections.get(section) || "";
    for (const pattern of patterns) {
      checks.push(`section pattern present (${section}): ${pattern}`);
      if (!new RegExp(pattern, "i").test(sectionText)) {
        failures.push(`section pattern missing (${section}): ${pattern}`);
      }
    }
  }

  for (const pattern of manifest.validation.forbidden_patterns) {
    checks.push(`forbidden pattern absent: ${pattern}`);
    if (new RegExp(pattern, "i").test(text)) failures.push(`forbidden pattern matched: ${pattern}`);
  }
  for (const pattern of manifest.validation.required_patterns) {
    checks.push(`required pattern present: ${pattern}`);
    if (!new RegExp(pattern, "i").test(text)) failures.push(`required pattern missing: ${pattern}`);
  }

  if (manifest.validation.require_evidence_labels) {
    checks.push("evidence language present");
    if (!/\b(verified|evidence|inference|uncertain|unknown)\b/i.test(text)) {
      failures.push("evidence or uncertainty language is missing");
    }
  }

  const usage = result.usage;
  const cost = usage.cost?.total;
  checks.push(`input tokens: ${usage.input}/${manifest.budget.max_input_tokens}`);
  checks.push(`output tokens: ${usage.output}/${manifest.budget.max_output_tokens}`);
  checks.push(`total tokens: ${usage.totalTokens}/${manifest.budget.max_total_tokens}`);
  checks.push(`cost USD: ${cost}/${manifest.budget.max_cost_usd}`);
  if (usage.input > manifest.budget.max_input_tokens) failures.push("input token budget exceeded");
  if (usage.output > manifest.budget.max_output_tokens) failures.push("output token budget exceeded");
  if (usage.totalTokens > manifest.budget.max_total_tokens) failures.push("total token budget exceeded");
  if (typeof cost !== "number" || cost > manifest.budget.max_cost_usd) failures.push("cost budget exceeded or missing");
  if (result.stopReason !== "stop") failures.push(`unexpected stop reason: ${result.stopReason}`);

  return { checks, failures, wordCount };
}

function timestampId(date) {
  return date.toISOString().replace(/[:.]/g, "-");
}

async function writeArtifacts(
  manifest,
  contractInfo,
  manifestSnapshot,
  contextInfo,
  reviewSource,
  result,
  outputValidation,
  startedAt,
  finishedAt
) {
  const year = String(finishedAt.getUTCFullYear());
  const month = String(finishedAt.getUTCMonth() + 1).padStart(2, "0");
  const runId = `${timestampId(finishedAt)}-${manifest.task_id}`;
  const outputDir = resolve(repoRoot, "operations/runs/usage", year, month);
  await mkdir(outputDir, { recursive: true });

  const outputPath = resolve(outputDir, `${runId}.md`);
  const manifestSnapshotPath = resolve(outputDir, `${runId}.manifest.json`);
  const receiptPath = resolve(outputDir, `${runId}.json`);
  await writeFile(outputPath, `${result.text}\n`, { flag: "wx" });
  await writeFile(manifestSnapshotPath, manifestSnapshot, { flag: "wx" });
  const outputHash = createHash("sha256").update(`${result.text}\n`).digest("hex");
  const usage = result.usage;
  const receipt = {
    schema: "systems_hub.run_receipt/v1",
    run_id: runId,
    task_id: manifest.task_id,
    task_kind: manifest.task_kind,
    started_at: startedAt.toISOString(),
    finished_at: finishedAt.toISOString(),
    provider: manifest.provider,
    model: manifest.model,
    contract: {
      ...contractInfo,
      manifest_path: relative(repoRoot, manifestSnapshotPath).split(sep).join("/")
    },
    context: {
      files: contextInfo.files.map(file => file.path),
      file_count: contextInfo.files.length,
      total_bytes: contextInfo.totalBytes
    },
    usage: {
      input: usage.input,
      output: usage.output,
      cache_read: usage.cacheRead,
      cache_write: usage.cacheWrite,
      total_tokens: usage.totalTokens,
      cost_usd: usage.cost.total
    },
    output: {
      path: relative(repoRoot, outputPath).split(sep).join("/"),
      sha256: outputHash,
      word_count: outputValidation.wordCount
    },
    validation: {
      status: outputValidation.failures.length === 0 ? "pass" : "fail",
      checks: outputValidation.checks,
      failures: outputValidation.failures
    },
    promotion: {
      eligible: outputValidation.failures.length === 0,
      human_review_required: true
    }
  };
  if (reviewSource) {
    receipt.review = {
      source_receipt: manifest.review.source_receipt,
      source_output: reviewSource.receipt.output.path,
      source_output_sha256: reviewSource.receipt.output.sha256
    };
  }
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
  return { receipt, receiptPath, outputPath };
}

async function main() {
  const validateOnly = process.argv[2] === "--validate-only";
  const manifestArgument = validateOnly ? process.argv[3] : process.argv[2];
  const expectedArguments = validateOnly ? 4 : 3;
  if (!manifestArgument || process.argv.length !== expectedArguments) {
    fail("usage: run-task-manifest.mjs [--validate-only] <manifest.json>");
  }
  const manifestPath = resolve(process.cwd(), manifestArgument);
  const taskDirectory = resolve(repoRoot, "operations/tasks");
  const taskRelative = relative(taskDirectory, manifestPath);
  if (taskRelative.startsWith("..") || taskRelative.split(sep).includes("..")) {
    fail("manifest must live under operations/tasks");
  }
  const manifestBytes = await readFile(manifestPath);
  const manifest = JSON.parse(manifestBytes.toString("utf8"));
  const manifestSnapshot = `${JSON.stringify(manifest, null, 2)}\n`;
  const contractInfo = {
    manifest_sha256: createHash("sha256").update(manifestSnapshot).digest("hex"),
    prompt_sha256: createHash("sha256").update(manifest.prompt).digest("hex"),
    ephemeral_manifest: basename(manifestPath).startsWith(".hub-runtime-")
  };
  validateManifest(manifest);
  const reviewSource = await validateReviewSource(manifest);
  const contextInfo = await validateContext(manifest, reviewSource);
  if (validateOnly) {
    process.stdout.write(
      `Manifest valid: ${manifest.task_id} (${manifest.execution_status}, ${contextInfo.files.length} files)\n`
    );
    return;
  }
  if (manifest.execution_status !== "manual") {
    fail(`task is not executable: execution_status=${manifest.execution_status}`);
  }

  const startedAt = new Date();
  const jsonl = await runLauncher(manifest, contextInfo);
  const result = extractAssistant(jsonl);
  const finishedAt = new Date();
  const outputValidation = validateOutput(manifest, result);
  const artifacts = await writeArtifacts(
    manifest,
    contractInfo,
    manifestSnapshot,
    contextInfo,
    reviewSource,
    result,
    outputValidation,
    startedAt,
    finishedAt
  );

  process.stdout.write(`${result.text}\n\n`);
  process.stdout.write(`Validation: ${artifacts.receipt.validation.status}\n`);
  process.stdout.write(`Tokens: ${artifacts.receipt.usage.total_tokens}\n`);
  process.stdout.write(`Cost USD: ${artifacts.receipt.usage.cost_usd}\n`);
  process.stdout.write(`Receipt: ${relative(repoRoot, artifacts.receiptPath)}\n`);
  process.stdout.write(`Output: ${relative(repoRoot, artifacts.outputPath)}\n`);

  if (artifacts.receipt.validation.status !== "pass") process.exitCode = 2;
}

main().catch(error => {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
});
