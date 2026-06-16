---
owner: harness-orchestrator
status: active
data_class: internal
date: 2026-06-16
---

# Agent Loop v2 Build

## Result

Added the first operational standard for compounding agent work.

## Artifacts

- `operations/loops/agent-loop-v2.md`
- `operations/loops/README.md`
- `runtime/adapters/pi/terminal-guide.md`
- `hub loop`
- `hub loop-check <receipt.json>`
- `hub pi-guide`

## Intent

The loop makes agents more persistent and less approval-seeking by default while preserving explicit approval boundaries for protected actions.

The terminal guide clarifies that Pi is not a Codex-style chat surface and that `hub` is the preferred operating interface for Systems Hub.

## Verification

- `hub loop` renders the active loop standard.
- `hub pi-guide` renders the terminal guide.
- `hub loop-check` validates mechanical receipt evidence.
