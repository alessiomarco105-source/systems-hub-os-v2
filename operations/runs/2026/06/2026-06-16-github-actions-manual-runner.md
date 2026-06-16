---
owner: harness-orchestrator
status: implemented
data_class: internal
updated: 2026-06-16
---

# GitHub Actions Manual Runner

## Scope

Prepared the first live GitHub Actions runner for Systems Hub OS v2.

## Implemented

- Added `.github/workflows/systems-hub-jobs.yml`.
- Workflow is manual-dispatch only.
- Workflow installs Node 24 and `@earendil-works/pi-coding-agent@0.79.4`.
- Workflow runs `hub job <job-id> --notify`.
- Workflow uploads receipts as artifacts.
- Workflow sends operations Telegram failure notification on failure.
- Updated Pi launcher to support cloud environment secrets when macOS Keychain and `sandbox-exec` are unavailable.
- Updated `hub status` to detect cloud-provided DeepSeek secrets.

## Safety

- No schedule is active.
- Repository permissions are read-only.
- No receipt commit-back is enabled.
- No protected-data job is included in workflow choices.
- Secrets are expected from GitHub Actions secrets, not repository files.

## Next Verification

After secrets are added to the GitHub repository, run manual dispatch with `job_id=daily-agent-recap`.
