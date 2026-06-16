---
owner: harness-orchestrator
status: draft-adapter
data_class: internal
updated: 2026-06-16
---

# Scheduler Adapter

Runtime script: `runtime/scripts/run-job.mjs`

The scheduler adapter maps `operations/jobs/registry.yaml` entries to governed task manifests.

## Runner Plans

- Local pilot: `runtime/scheduler/local-runner.md`
- Cloud runner decision: `runtime/scheduler/cloud-runner.md`
- GitHub Actions runbook: `runtime/scheduler/github-actions-runbook.md`
- GitHub Actions workflow template: `runtime/scheduler/templates/github-actions-systems-hub-jobs.yml.md`

## Commands

```bash
hub jobs
hub job weekly-business-review --dry-run
hub job daily-agent-recap --dry-run
hub job social-kpi-report --dry-run
hub job weekly-business-review --notify
```

Manual job execution and Telegram notification delivery are available through the v2 CLI. GitHub Actions cloud schedules are active for the core v2 routine set.

## Notification Mapping

Each job declares its notification channel in `operations/jobs/registry.yaml`.

- `weekly-business-review`: `operations`
- `daily-agent-recap`: `operations`
- `security-exposure-review`: `operations`
- `social-kpi-report`: `social`

## Active Cloud Schedules

| Job | Runner | Cron | Notes |
|---|---|---:|---|
| `daily-agent-recap` | GitHub Actions | `0 0 * * *` UTC | 20:00 America/New_York during EDT |
| `weekly-business-review` | GitHub Actions | `0 12 * * 1` UTC | 08:00 America/New_York during EDT |
| `social-kpi-report` | GitHub Actions | `0 23 * * 0` UTC | 19:00 America/New_York during EDT |
| `security-exposure-review` | GitHub Actions | `0 14 */3 * *` UTC | Every third UTC day at 14:00; calendar-month reset accepted for v1 |

## Cutover

Legacy Codex automations should remain active until each v2 job has passed dry-run, manual execution, Telegram test, scheduled execution, and receipt verification.
