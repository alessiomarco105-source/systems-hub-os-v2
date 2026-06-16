---
owner: harness-orchestrator
status: active
data_class: internal
date: 2026-06-16
---

# Core Routine Cutover Proof

## Result

The v2 Pi/DeepSeek runtime has passing local routine proof for:

- `weekly-business-review`
- `social-kpi-report`
- `security-exposure-review`

`daily-agent-recap` already had prior local and GitHub Actions manual proof.

## Passing Receipts

| Job | Receipt | Telegram |
|---|---|---|
| `weekly-business-review` | `operations/runs/usage/2026/06/2026-06-16T16-38-56-179Z-weekly-business-review.json` | sent to operations |
| `social-kpi-report` | `operations/runs/usage/2026/06/2026-06-16T16-44-48-961Z-social-kpi-report.json` | sent to social |
| `security-exposure-review` | `operations/runs/usage/2026/06/2026-06-16T16-44-12-771Z-security-exposure-review.json` | sent to operations |

## Failed Calibration Receipts

The following failures were used for manifest calibration and should not be treated as cutover proof:

- `2026-06-16T16-36-24-390Z-weekly-business-review`: unsupported payment-provider example.
- `2026-06-16T16-39-51-050Z-social-kpi-report`: preamble and section keyword misses.
- `2026-06-16T16-42-48-015Z-security-exposure-review`: word count and approval-section keyword miss.

## Controls Added

- `run-job.mjs` now skips success-style Telegram notifications when validation/runtime fails.
- Protected-data tasks require an explicit provider access approval artifact.
- Core routine schedules are mapped in GitHub Actions by cron string.

## Remaining Proof

GitHub Actions manual dispatch must pass for:

- `weekly-business-review`
- `social-kpi-report`
- `security-exposure-review`

Scheduled proof remains pending until each cron fires naturally.
