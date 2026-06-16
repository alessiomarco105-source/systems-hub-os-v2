---
owner: harness-orchestrator
status: implemented
data_class: internal
updated: 2026-06-16
---

# Telegram and Scheduler v2 Layer

## Scope

Marco approved continuing with the full bot and automation migration layer.

## Implemented

- Added shared Telegram channel configuration for `operations`, `social`, `signup`, and `interactive`.
- Added `hub telegram health` for credential inventory without printing secrets.
- Added `hub telegram router --dry-run` as the interactive routing scaffold.
- Made job notification channels explicit in `operations/jobs/registry.yaml`.
- Updated job runner notification routing to read `notify_channel`.
- Updated status/docs to show local v2 notification readiness accurately.
- Added local and cloud runner runbooks.

## Verified

- Syntax checks passed for the Telegram scripts, job runner, and CLI.
- `hub telegram health` reports `operations`, `social`, and `signup` as ready.
- `hub telegram router --dry-run` runs without fetching Telegram updates or sending replies.
- `hub jobs` shows notification channels for each scheduled job.

## Still Pending

- Interactive bot credentials for `@Systemshub_bot`.
- Inbound webhook/polling activation and agent task-envelope creation.
- Cloud runner selection and secret migration.
- Scheduled v2 receipts from the selected runner.
- Rotation of the signup bot token that was visible during setup.
