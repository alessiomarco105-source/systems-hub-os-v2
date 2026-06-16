---
owner: harness-orchestrator
status: decision-needed
data_class: internal
updated: 2026-06-16
---

# Cloud Runner

Systems Hub OS v2 can run jobs locally, but local jobs stop when Marco's laptop is closed, asleep, offline, or out of battery.

## Requirement

For reliable Telegram recaps while the laptop is closed, use an always-on runner.

## Recommended Shape

Use a small private cloud runner that:

- checks out the Systems Hub OS v2 repository;
- stores DeepSeek and Telegram credentials in the cloud secret manager, not in Git;
- runs `hub job <job-id> --notify` on the approved cadence;
- uploads/commits or otherwise preserves run receipts;
- sends failure notifications to the operations channel.

## Minimum Jobs

| Job | Cadence | Channel |
|---|---:|---|
| `weekly-business-review` | Monday 08:00 America/New_York | `operations` |
| `daily-agent-recap` | Daily 20:00 America/New_York | `operations` |
| `security-exposure-review` | Every three days | `operations` |
| `social-kpi-report` | Sunday 19:00 America/New_York | `social` |

## Boundary

Do not migrate secrets or activate cloud schedules until Marco approves the selected runner and secret storage path.
