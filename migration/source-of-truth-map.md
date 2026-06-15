# Source of Truth Map

| Domain | Legacy Sources | V2 Canonical Target | Status |
|---|---|---|---|
| Company authority | `AGENTS.md`, `CLAUDE.md`, `.claude/rules/` | `governance/`, root `AGENTS.md` | Seeded; reconciliation pending |
| Agent roles | `.claude/agents/`, `.codex/agents/`, `TEAM.md` | `agents/roles/`, `agents/registry.yaml` | Canonical contracts seeded |
| Shared capabilities | harness capability folders and operational wiki | `capabilities/` | Structure seeded; content pending |
| Company strategy | `wiki/systems-hub/`, `wiki/marco/current-priorities.md` | `company/` | Reviewed company layer consolidated |
| Projects | root `projects/`, harness project packages, product wiki | `projects/` | Trader's Hub project package consolidated |
| Trader's Hub code | separate product repository | separate product repository referenced by manifest | Preserved |
| Decisions | `decisions/log.md` | `operations/decisions/` | Active decisions consolidated; history pending |
| Scheduled jobs | Codex automation configs and harness job docs | `operations/jobs/` plus generated runtime adapters | Canonical job definitions consolidated; provider adapters pending |
| Run evidence | harness `runs/` | `operations/runs/YYYY/MM/` | Pending archive migration |
| Runtime scripts | `tools/harness/` | `runtime/scripts/` | Pending code review |
| Finance | `finance/` and finance wiki | restricted store plus `capabilities/finance/` methods | Raw data excluded |
| Personal context | `wiki/marco/` | restricted personal store plus minimal approved extracts | Raw data excluded |
| Prospects | `wiki/people/` | restricted relationship store | Excluded |
| Temporary media | `tmp/`, `exports/` | external artifact storage | Excluded |
