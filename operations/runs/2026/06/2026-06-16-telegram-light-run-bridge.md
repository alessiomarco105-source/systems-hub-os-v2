---
owner: harness-orchestrator
status: implemented
data_class: internal
updated: 2026-06-16
---

# Telegram Light-Run Bridge

## Scope

Added a bridge from light-approved Telegram envelopes to governed read-only task runs.

## Implemented

- `hub telegram run-light <envelope-id> --dry-run`
- `hub telegram run-light <envelope-id> [--review]`
- Light-run mapping for:
  - `harness-orchestrator` → `daily-agent-recap`
  - `chief-of-staff-business` → `cos-business-executive-brief`
  - `cmo` → `social-kpi-report`
- Envelope inspection now shows a light-run preview command.
- Envelope execution marks a completed envelope as `light_run_completed` after a successful run.

## Verified

- Syntax check passed for `runtime/scripts/hub-cli.mjs`.
- Test envelope inspection shows its tier and preview command.
- `hub telegram run-light <test-envelope> --dry-run` maps to `daily-agent-recap` and does not spend tokens.

## Boundary

Light-run refuses Tier 2/Tier 3 envelopes, non-pending envelopes, envelopes with unlocked permissions, likely secrets, and agents without a reviewed safe task mapping.
