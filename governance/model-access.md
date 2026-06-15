---
owner: harness-orchestrator
reviewer: security-officer
status: canonical
data_class: internal
core_protected: true
updated: 2026-06-15
---

# Model Access Policy

Every run declares:

- provider and model;
- agent role;
- company or project scope;
- allowed data classes;
- allowed read and write paths;
- tools and network destinations;
- token budget;
- stop conditions.

Models receive selected files or extracts, never unrestricted repository credentials or blanket filesystem access.

Default provider boundary:

- Public and ordinary internal context: task-scoped access.
- Private, customer, finance, personal, or proprietary-code context: excluded until explicitly approved for that provider and task.
- Secrets: always excluded.
- Governance and runtime authority: read-only.

Technical enforcement is mandatory for unattended runs: read-only mounts, path allowlists, redaction, isolated workspaces, provider tiers, and context audit logs.
