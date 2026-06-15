---
owner: security-officer
coordinator: harness-orchestrator
status: active-definition
data_class: protected
cadence: every-three-days
updated: 2026-06-15
---

# Security Exposure Review

## Purpose

Run non-destructive security and integrity checks across the Systems Hub OS and approved active project repositories.

## Routine

1. Confirm approved local scope.
2. Scan changed and tracked files for likely secrets.
3. Review credential-file handling and unexpected sensitive files.
4. Run project-native dependency and security checks.
5. Inspect executable scripts, hooks, automations, permission changes, and protected-path changes.
6. Rank findings by severity and create a run receipt.
7. Notify Marco for critical or high findings, failed automation, or required approval.

No production exploitation, destructive payloads, third-party testing, secret values in reports, dependency changes, credential rotation, or permission widening without explicit approval.
