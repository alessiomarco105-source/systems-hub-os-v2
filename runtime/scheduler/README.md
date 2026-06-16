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
```

Actual scheduled activation is pending. The local CLI adapter exists, but no launchd, cron, or cloud schedule has been activated in v2.

## Cutover

Legacy Codex automations should remain active until each v2 job has passed dry-run, manual execution, Telegram test, scheduled execution, and receipt verification.
