#!/usr/bin/env node

import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(scriptPath), "../..");
const taskRunner = resolve(repoRoot, "runtime/scripts/run-task-manifest.mjs");
const telegram = resolve(repoRoot, "runtime/scripts/telegram-notify.mjs");

function fail(message) {
  throw new Error(message);
}

function parseArgs(args) {
  const options = { dryRun: false, notify: false };
  const positional = [];
  for (const arg of args) {
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--notify") options.notify = true;
    else if (arg.startsWith("--")) fail(`unsupported option: ${arg}`);
    else positional.push(arg);
  }
  if (positional.length !== 1) fail("usage: run-job.mjs <job-id> [--dry-run] [--notify]");
  options.jobId = positional[0];
  return options;
}

async function jobRegistry() {
  const text = await readFile(resolve(repoRoot, "operations/jobs/registry.yaml"), "utf8");
  const jobs = [];
  let current;
  for (const line of text.split(/\r?\n/)) {
    const start = /^\s*-\s+id:\s+(.+?)\s*$/.exec(line);
    if (start) {
      if (current) jobs.push(current);
      current = { id: start[1] };
      continue;
    }
    if (!current) continue;
    const field = /^\s{4}([a-z0-9_]+):\s+(.+?)\s*$/.exec(line);
    if (field) current[field[1]] = field[2];
  }
  if (current) jobs.push(current);
  return jobs;
}

function spawnCapture(command, args) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { cwd: repoRoot, env: process.env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", chunk => { stdout += chunk; });
    child.stderr.on("data", chunk => { stderr += chunk; });
    child.on("error", rejectPromise);
    child.on("close", code => resolvePromise({ code: code ?? 1, stdout, stderr }));
  });
}

function notificationChannel(job) {
  if (job.id === "social-kpi-report") return "social";
  return "operations";
}

function summarize(job, output) {
  const receipt = output.match(/^Receipt:\s+(.+)$/m)?.[1] || "receipt unknown";
  const validation = output.match(/^Validation:\s+(.+)$/m)?.[1] || "unknown";
  const cost = output.match(/^Cost USD:\s+(.+)$/m)?.[1] || "unknown";
  return [
    `Systems Hub job: ${job.id}`,
    `Validation: ${validation}`,
    `Cost: ${cost}`,
    `Receipt: ${receipt}`
  ].join("\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const job = (await jobRegistry()).find(item => item.id === options.jobId);
  if (!job) fail(`unknown job: ${options.jobId}`);
  const manifest = job.task_manifest?.replace(/^\.\.\//, "operations/");
  if (!manifest) fail(`job has no task manifest: ${job.id}`);

  if (options.dryRun) {
    process.stdout.write(`Job dry-run: ${job.id}\n`);
    process.stdout.write(`Owner: ${job.owner}\n`);
    process.stdout.write(`Schedule: ${job.schedule} ${job.timezone}\n`);
    process.stdout.write(`Manifest: ${manifest}\n`);
    process.stdout.write(`Channel: ${notificationChannel(job)}\n`);
    process.stdout.write(`Would run: node ${taskRunner} ${manifest}\n`);
    process.stdout.write(`Would notify: ${options.notify ? "yes" : "no"}\n`);
    return;
  }

  const result = await spawnCapture(process.execPath, [taskRunner, manifest]);
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  if (result.code !== 0) process.exitCode = result.code;

  if (options.notify) {
    const message = summarize(job, result.stdout);
    const notify = await spawnCapture(process.execPath, [
      telegram,
      "--channel", notificationChannel(job),
      "--text", message
    ]);
    process.stdout.write(notify.stdout);
    process.stderr.write(notify.stderr);
    if (notify.code !== 0) process.exitCode = notify.code;
  }
}

main().catch(error => {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
});
