---
owner: harness-orchestrator
status: draft-runbook
data_class: internal
updated: 2026-06-16
---

# GitHub Actions Cloud Runner Runbook

This runbook describes the recommended v1 cloud runner. It does not activate schedules by itself.

## Why GitHub Actions First

- GitHub is already intended as the final source of truth.
- Scheduled workflows can run while Marco's laptop is closed.
- Repository secrets can store DeepSeek and Telegram credentials outside Git.
- Workflow logs and artifacts give basic observability.
- Manual `workflow_dispatch` allows safe testing before schedule activation.

## Setup Steps

1. Confirm `systems-hub-os-v2` is pushed to the private GitHub source-of-truth repo.
2. Add required secrets in GitHub repository settings.
3. Use `.github/workflows/systems-hub-jobs.yml`.
4. Start with `workflow_dispatch`, then activate one schedule at a time after manual verification.
5. Run `daily-agent-recap` manually.
6. Verify:
   - Telegram notification arrived;
   - receipt/output artifact exists;
   - no secrets printed in logs;
   - workflow exited successfully.
7. Activate one schedule at a time.
8. Keep legacy automation active until the v2 scheduled run passes at the expected time.

## Secrets

Minimum v1:

- `SYSTEMS_HUB_DEEPSEEK_API_KEY`
- `SYSTEMS_HUB_TELEGRAM_OPERATIONS_BOT_TOKEN`
- `SYSTEMS_HUB_TELEGRAM_OPERATIONS_CHAT_ID`
- `SYSTEMS_HUB_TELEGRAM_SOCIAL_BOT_TOKEN`
- `SYSTEMS_HUB_TELEGRAM_SOCIAL_CHAT_ID`

Optional later:

- `SYSTEMS_HUB_TELEGRAM_SIGNUP_BOT_TOKEN`
- `SYSTEMS_HUB_TELEGRAM_SIGNUP_CHAT_ID`
- `SYSTEMS_HUB_TELEGRAM_INTERACTIVE_BOT_TOKEN`
- `SYSTEMS_HUB_TELEGRAM_INTERACTIVE_CHAT_ID`

## First Manual Test

Run:

```text
workflow_dispatch -> job_id=daily-agent-recap
```

Expected:

- GitHub workflow succeeds.
- Operations Telegram receives a recap notification.
- Artifact contains `operations/runs/usage/...daily-agent-recap...`.
- `hub telegram health` equivalent in workflow logs shows required channels present without printing secret values.

## Current Workflow

The workflow is present at `.github/workflows/systems-hub-jobs.yml`.

It:

- installs Node 24;
- installs `@earendil-works/pi-coding-agent@0.79.4`;
- links `hub`;
- verifies `hub status`, `hub telegram health`, and `hub job <job-id> --dry-run`;
- runs `hub job <job-id> --notify`;
- uploads run receipts as artifacts;
- sends an operations Telegram failure notification if the workflow fails.

It currently has active schedules for:

- `daily-agent-recap`: `0 0 * * *` UTC, which is 20:00 America/New_York during EDT.
- `weekly-business-review`: `0 12 * * 1` UTC, which is 08:00 America/New_York during EDT.
- `social-kpi-report`: `0 23 * * 0` UTC, which is 19:00 America/New_York during EDT.
- `security-exposure-review`: `0 14 */3 * *` UTC, every third UTC day at 14:00; calendar-month reset accepted for v1.

It does not:

- commit receipts back to the repo;
- process inbound Telegram envelopes.

## Manual Proof Status

As of 2026-06-16:

- `daily-agent-recap`: GitHub Actions manual dispatch passed.
- `weekly-business-review`: local v2 run and Telegram delivery passed; GitHub Actions manual dispatch pending.
- `social-kpi-report`: local v2 run and Telegram delivery passed; GitHub Actions manual dispatch pending.
- `security-exposure-review`: local v2 run and Telegram delivery passed with provider access approval; GitHub Actions manual dispatch pending.

## Schedule Activation Order

1. `daily-agent-recap`
2. `weekly-business-review`
3. `social-kpi-report`
4. `security-exposure-review`

## Rollback

If the cloud runner behaves incorrectly:

1. Disable the workflow schedule.
2. Keep manual dispatch disabled if needed.
3. Leave legacy automation active.
4. Inspect artifacts/logs.
5. Fix locally, commit, and rerun manual dispatch.

## Non-Goals

The GitHub Actions runner must not:

- run inbound Telegram polling continuously;
- process unapproved Telegram envelopes;
- write product code;
- deploy;
- publish content;
- send outreach;
- alter secrets;
- rotate credentials;
- change governance/routing/security policy.
