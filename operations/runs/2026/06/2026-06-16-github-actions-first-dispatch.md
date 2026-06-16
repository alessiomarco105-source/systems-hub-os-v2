---
owner: harness-orchestrator
status: failed-fixed
data_class: internal
updated: 2026-06-16
---

# GitHub Actions First Dispatch

## Run

- Workflow run: `27620982812`
- Job: `daily-agent-recap`
- Trigger: manual dispatch

## Result

The cloud runner successfully reached the model execution step, produced a valid `daily-agent-recap` output, and passed validation.

The workflow failed after the model run during Telegram notification delivery.

## Failure

Telegram send failed with:

```text
Request path contains unescaped characters
```

The failure notification step failed with the same error.

## Fix

Updated Telegram credential loading to trim environment-provided secret values before use. Keychain values were already trimmed locally, but GitHub Actions secrets enter through environment variables.

Also set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` in the workflow to opt into GitHub's Node 24 action runtime and reduce deprecation noise.

## Safety

- No secrets appeared in logs.
- No schedule was activated.
- Receipts were uploaded as artifacts by the failed workflow.
