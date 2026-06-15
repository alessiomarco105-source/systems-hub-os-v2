# Systems Hub LLC Agent Entry Point

This file is the minimal provider-neutral instruction entry point.

## Authority

Marco is founder, CEO, and final approver. Models and agents are bounded workers.

## Before Work

1. Read `governance/constitution.md`.
2. Read only the governance sections required by the task.
3. Read `agents/registry.yaml` and the selected role.
4. For project work, read `projects/registry.yaml` and that project's manifest.
5. Load only task-relevant capability and knowledge files.

## Universal Rules

- Think independently and state material objections.
- Separate facts, inference, recommendation, and uncertainty.
- Never expose or request secrets in prompts or tracked files.
- Never modify governance, agent authority, routing, runtime authority, or security controls without Marco's approval for the exact change.
- Never post, send, pay, deploy, merge, or make an external commitment without the required approval.
- Use minimum sufficient context and record model usage when available.
- Leave a receipt for meaningful work.

Approval syntax:

```text
approved: [specific action]
```

## Data Boundaries

Follow `governance/model-access.md`. If the provider, data class, path, or tool permission is unclear, use the more restrictive interpretation and stop.
