---
owner: harness-orchestrator
status: draft-runbook
data_class: internal
updated: 2026-06-16
---

# Local Runner

The local runner is useful for pilot testing v2 schedules on Marco's Mac.

## Limitation

Local schedules do not run when the Mac is asleep, powered off, offline, or blocked from network access.

## Manual Pilot Commands

```bash
hub job weekly-business-review --notify
hub job daily-agent-recap --notify
hub job security-exposure-review --notify
hub job social-kpi-report --notify
```

## Activation Rule

Use local scheduling only for pilot verification. Final operations should move to the cloud runner so Telegram reports still arrive when the laptop is closed.
