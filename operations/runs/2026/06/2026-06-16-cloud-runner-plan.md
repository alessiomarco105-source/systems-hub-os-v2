---
owner: harness-orchestrator
status: planned
data_class: internal
updated: 2026-06-16
---

# Cloud Runner Plan

## Scope

Built the v1 cloud runner plan for Systems Hub OS v2.

## Decision

Recommended GitHub Actions as the first cloud runner because it is closest to the GitHub source-of-truth model, supports scheduled and manual workflows, has repository secrets, and is sufficient for short routine jobs.

## Implemented

- Expanded `runtime/scheduler/cloud-runner.md` into a decision-ready plan.
- Added `runtime/scheduler/github-actions-runbook.md`.
- Added non-active workflow template at `runtime/scheduler/templates/github-actions-systems-hub-jobs.yml.md`.
- Updated scheduler README.
- Updated full migration status.

## Safety

- No live `.github/workflows/*.yml` file was created.
- No cloud secrets were moved.
- No schedule was activated.
- The workflow template intentionally fails at the Pi install step until the cloud-safe install command is verified.
- Initial workflow permissions are read-only; receipt commit-back is deferred.

## Next Approval

Marco must approve the cloud runner activation step before creating a live workflow or adding repository secrets.
