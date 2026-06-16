---
owner: harness-orchestrator
status: decision-ready
data_class: internal
updated: 2026-06-16
---

# Cloud Runner Plan

Systems Hub OS v2 can run jobs locally, but local jobs stop when Marco's laptop is closed, asleep, offline, or out of battery.

The cloud runner is the always-on execution layer for routine reports and Telegram notifications.

## Recommendation

Option 1: GitHub Actions runner
- What it does: Runs scheduled `hub job <job-id> --notify` commands from the repository source of truth.
- Trade-off: Easiest v1 path, but scheduled workflows are tied to GitHub Actions reliability, repo secrets, and workflow-minute billing.

Option 2: Small VPS/Fly-style runner
- What it does: Runs the harness on a private always-on machine or scheduled machine with its own secret store.
- Trade-off: More control and better for long-running agents, but more setup, monitoring, patching, and operational burden.

→ Recommendation: Option 1 for the first cloud runner. Move to Option 2 only when agents need long-running loops, browser automation, media processing, or stronger isolation than GitHub Actions provides.

## V1 Architecture

```text
GitHub repo
  -> scheduled workflow
  -> installs Node + Pi
  -> restores/caches dependencies
  -> injects secrets from GitHub Actions secrets
  -> runs hub job <job-id> --notify
  -> writes run receipts/output
  -> commits receipts back or uploads artifacts
  -> sends Telegram success/failure notice
```

## Required Cloud Secrets

Store these in the selected runner's secret manager. Do not commit them.

| Secret | Purpose |
|---|---|
| `SYSTEMS_HUB_DEEPSEEK_API_KEY` | Model execution |
| `SYSTEMS_HUB_TELEGRAM_OPERATIONS_BOT_TOKEN` | Operations notifications |
| `SYSTEMS_HUB_TELEGRAM_OPERATIONS_CHAT_ID` | Operations chat |
| `SYSTEMS_HUB_TELEGRAM_SOCIAL_BOT_TOKEN` | Social KPI notifications |
| `SYSTEMS_HUB_TELEGRAM_SOCIAL_CHAT_ID` | Social KPI chat |
| `SYSTEMS_HUB_TELEGRAM_SIGNUP_BOT_TOKEN` | Signup alerts, if product-side flow is migrated |
| `SYSTEMS_HUB_TELEGRAM_SIGNUP_CHAT_ID` | Signup alert chat |
| `SYSTEMS_HUB_TELEGRAM_INTERACTIVE_BOT_TOKEN` | Interactive replies, only if cloud inbound routing is activated |
| `SYSTEMS_HUB_TELEGRAM_INTERACTIVE_CHAT_ID` | Interactive owner chat |

For v1 scheduled reports, only DeepSeek, operations, and social secrets are required.

## Minimum Scheduled Jobs

| Job | Schedule | Timezone | Channel | V1 activation |
|---|---:|---|---|---|
| `daily-agent-recap` | Daily 20:00 | America/New_York | `operations` | yes |
| `weekly-business-review` | Monday 08:00 | America/New_York | `operations` | yes |
| `social-kpi-report` | Sunday 19:00 | America/New_York | `social` | yes, after KPI source inputs exist |
| `security-exposure-review` | Every three days | America/New_York | `operations` | no, needs protected-data provider approval first |

## Cutover Gate

Do not disable legacy automations until each v2 job has:

1. passed local `hub job <job-id> --dry-run`;
2. passed local `hub job <job-id> --notify` with Marco approval;
3. passed one cloud manual dispatch;
4. produced a valid cloud receipt;
5. sent the expected Telegram notification;
6. committed or uploaded the receipt/output;
7. passed one scheduled run at the expected time.

## Failure Policy

Every cloud job must:

- send a Telegram failure notification to `operations`;
- keep logs/artifacts for review;
- never retry more than once automatically;
- never run protected work;
- never publish, send outreach, pay, deploy, rotate secrets, or change governance.

## Cost Control

- Start with only `daily-agent-recap` and `weekly-business-review`.
- Keep `social-kpi-report` off until real KPI files/exports exist.
- Keep `security-exposure-review` off until protected-data approval is resolved.
- Run `hub tokens --days 7 --limit 10` weekly.
- Cap model runs inside task manifests; do not rely on runner-level billing alone.

## Activation Boundary

This file is a plan. Do not create active cloud schedules, move secrets, or retire legacy automations until Marco approves the exact runner and activation step.
