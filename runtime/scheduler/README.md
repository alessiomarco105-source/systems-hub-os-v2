---
owner: harness-orchestrator
status: draft-adapter
data_class: internal
updated: 2026-06-16
---

# Scheduler Adapter

Runtime script: `runtime/scripts/run-job.mjs`

The scheduler adapter maps `operations/jobs/registry.yaml` entries to governed task manifests.

## Commands

```bash
hub jobs
hub job weekly-business-review --dry-run
hub job daily-agent-recap --dry-run
hub job social-kpi-report --dry-run
hub job weekly-business-review --notify
```

Manual job execution and Telegram notification delivery are available through the v2 CLI. Actual unattended scheduled activation is pending: no launchd, cron, or cloud schedule has been activated in v2.

## Notification Mapping

Each job declares its notification channel in `operations/jobs/registry.yaml`.

- `weekly-business-review`: `operations`
- `daily-agent-recap`: `operations`
- `security-exposure-review`: `operations`
- `social-kpi-report`: `social`

## Cutover

Legacy Codex automations should remain active until each v2 job has passed dry-run, manual execution, Telegram test, scheduled execution, and receipt verification.
