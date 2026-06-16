---
owner: harness-orchestrator
status: activated
data_class: internal
updated: 2026-06-16
---

# Daily Recap Cloud Schedule Activation

## Scope

Activated the first unattended GitHub Actions schedule for Systems Hub OS v2.

## Activated

- Job: `daily-agent-recap`
- Runner: GitHub Actions
- Workflow: `.github/workflows/systems-hub-jobs.yml`
- Cron: `0 0 * * *` UTC
- Operational target: 20:00 America/New_York during EDT
- Notification channel: `operations`

## Safety

- Weekly business review remains manual.
- Social KPI report remains manual.
- Security exposure review remains inactive.
- Repository permissions remain read-only.
- Receipt commit-back remains disabled; receipts are uploaded as artifacts.
- Inbound Telegram envelopes are not processed by the cloud runner.

## Verification Needed

The schedule is activated but not yet proven. It must complete one scheduled run at the expected time before legacy automation retirement is considered.

## Known Limitation

GitHub cron uses UTC. This schedule matches 20:00 New York during EDT; daylight-saving changes require later review.
