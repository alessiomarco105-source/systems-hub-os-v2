# Full Pi Migration Adapters

Date: 2026-06-16
Scope: Start replacing legacy Codex routine execution with Systems Hub v2 Pi/DeepSeek job execution and Telegram delivery adapters.

## Built

- Added `runtime/scripts/run-job.mjs`.
- Added `runtime/scripts/telegram-notify.mjs`.
- Added `hub jobs`.
- Added `hub job <job-id> [--dry-run] [--notify]`.
- Updated job registry status to `migration-in-progress`.
- Added full migration status and cutover rules.
- Added Telegram adapter documentation.
- Added scheduler adapter documentation.

## Safety

- No legacy automation was disabled.
- No schedule was activated.
- No Telegram message was sent.
- No model run was triggered by dry-run verification.
- Telegram secrets remain outside the repository.

## Verification

- `node --check runtime/scripts/hub-cli.mjs` passed.
- `node --check runtime/scripts/run-job.mjs` passed.
- `node --check runtime/scripts/telegram-notify.mjs` passed.
- `git diff --check` passed.
- `hub jobs` showed v2 job migration status.
- `hub job weekly-business-review --dry-run` passed without model or Telegram side effects.
- `hub job daily-agent-recap --dry-run` passed without model or Telegram side effects.
- `hub job social-kpi-report --dry-run` passed without model or Telegram side effects.
- `hub job security-exposure-review --dry-run` passed without model or Telegram side effects.
- `hub validate` passed for all task manifests.
- `telegram-notify.mjs --dry-run` passed without network delivery.

## Incident During Build

An initial `hub job ... --dry-run` test exposed a boolean flag parsing bug in `hub-cli.mjs`: non-`review` boolean flags were being assigned as `review=true`. This caused one attempted `daily-agent-recap` job to reach DeepSeek before interruption. It did not send Telegram. The resulting failed receipt was retained as audit evidence:

- `operations/runs/usage/2026/06/2026-06-16T07-16-51-941Z-daily-agent-recap.json`

Fix applied:

- boolean flags now set their own option key;
- job registry parsing now supports keys containing digits, such as `v2_execution`;
- dry-run was re-tested successfully.

## Incident During First Notify Test

The first approved `weekly-business-review --notify` test succeeded and sent Telegram, but a second weekly-business-review receipt appeared. Root cause: the earlier interrupted `weekly-business-review` child process from the dry-run parser bug continued running after `Ctrl+C` and finished later.

Audit receipts retained:

- approved notify run: `operations/runs/usage/2026/06/2026-06-16T09-22-46-386Z-weekly-business-review.json`
- orphaned interrupted run: `operations/runs/usage/2026/06/2026-06-16T09-22-54-228Z-weekly-business-review.json`

Fix applied:

- `run-job.mjs` now forwards `SIGINT` and `SIGTERM` to the active child process and returns code `130` for interrupted runs.
