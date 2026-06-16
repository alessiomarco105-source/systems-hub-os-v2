---
owner: harness-orchestrator
status: active-migration
data_class: internal
updated: 2026-06-16
---

# Full Pi Migration

## Target

Systems Hub v2 becomes the operational source of truth and routine runner.

Pi and DeepSeek provide governed model execution through task manifests. Codex automations are retired after v2 scheduler and Telegram delivery are verified.

## Reality Check

Pi plus an LLM is not enough for unattended operations. A complete system still needs:

- a scheduler to wake jobs;
- a notification adapter to send Telegram messages;
- key storage outside the repo;
- run receipts and validation;
- a human approval boundary for protected actions.

## Migration Status

| Layer | Status |
|---|---|
| Canonical company/project context | built |
| Agent registry | built |
| Pi/DeepSeek restricted launcher | built |
| Task manifests | built |
| Output validation and receipts | built |
| Manual `hub` CLI | built |
| TUI agent/router access | built |
| Job registry | built |
| v2 job dry-run adapter | built |
| Telegram outbound adapter | built and locally tested |
| Telegram interactive router | scaffolded, not activated |
| Scheduler activation | core routine schedules active in GitHub Actions |
| Codex automation retirement | no local Codex automation files found in this workspace; monitor sidebar/manual state |
| Cloud/always-on runner | GitHub Actions active for core routines |
| Cloud manual dispatch proof | passed for all core routines |

## Core Routine Local Proof

As of 2026-06-16, local v2 model execution and Telegram delivery have passed for:

- `daily-agent-recap`
- `weekly-business-review`
- `social-kpi-report`
- `security-exposure-review`

See `operations/runs/2026/06/2026-06-16-core-routine-cutover-proof.md`.

## Cloud Manual Proof

As of 2026-06-16, GitHub Actions manual dispatch has passed for all core routines:

- `daily-agent-recap`: `27621139099`
- `weekly-business-review`: `27633512843`
- `social-kpi-report`: `27633512776`
- `security-exposure-review`: `27633512810`

## Passive Verification Remaining

Natural scheduled proof remains pending until the cron schedules fire. No additional build work is required for that proof; monitor GitHub Actions and Telegram delivery after each scheduled time.

## Cutover Rule

Do not disable a legacy automation until the matching v2 job has:

1. passed `hub job <job-id> --dry-run`;
2. passed one manual model run through `hub job <job-id>`;
3. produced a valid receipt;
4. sent a Telegram test message with Marco approval;
5. been scheduled in the selected runner;
6. produced one scheduled receipt at the expected time.

## Runner Decision

Option 1: Local Mac runner
- What it does: uses this machine for scheduled jobs.
- Trade-off: jobs do not run when the Mac is asleep/offline.

Option 2: Cloud runner
- What it does: runs jobs even when the laptop is closed.
- Trade-off: needs cloud setup, secrets management, and monitoring.

→ Recommendation: Option 2 for final operations; use Option 1 only for short pilot testing.

Current v1 plan: use GitHub Actions first, with manual dispatch before schedules and artifacts before commit-back.
