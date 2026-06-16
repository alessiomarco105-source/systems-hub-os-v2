# Telegram Light-Run Mapping

Only Tier 0/Tier 1 envelopes can use `hub telegram run-light`.

| Proposed agent | Task manifest | Status |
|---|---|---|
| `harness-orchestrator` | `daily-agent-recap` | enabled |
| `chief-of-staff-business` | `cos-business-executive-brief` | enabled |
| `cmo` | `social-kpi-report` | enabled |

Agents not listed here require a new reviewed task manifest before Telegram light-run execution is allowed.

## Boundary

Light-run uses the same restricted task runner as `hub run`. It does not enable writes, replies, commits, deploys, payments, posts, outreach, or scheduler changes.
