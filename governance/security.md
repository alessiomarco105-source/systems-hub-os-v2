---
owner: security-officer
approver: marco
status: canonical
data_class: internal
core_protected: true
updated: 2026-06-15
---

# Security Policy

## Data Classes

| Class | Examples | Model Handling |
|---|---|---|
| Public | Approved public content | Approved providers |
| Internal | Strategy, project plans, operating knowledge | Task-scoped approved providers |
| Private | Finance, personal context, prospects, tester feedback | Explicit need and provider approval |
| Secret | API keys, passwords, tokens, payment credentials | Never sent to a model |
| Protected | Auth, RLS, legal, payments, production, governance | Read minimum; changes require review and approval |

## Required Boundaries

- Core governance is read-only to routine agents.
- Project work occurs in isolated workspaces or branches.
- Secrets live in an external secret store.
- Extensions and skills are untrusted until reviewed and pinned.
- Unattended agents require OS/container isolation, path allowlists, tool allowlists, and restricted network access.
- Security tests are non-destructive and limited to authorized local, test, or preview targets.
