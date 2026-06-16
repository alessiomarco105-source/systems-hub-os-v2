---
owner: harness-orchestrator
status: canonical
data_class: internal
core_protected: true
updated: 2026-06-15
---

# Work Lifecycle

1. **Intake:** define owner, scope, goal, output, permissions, budget, and stop conditions.
2. **Context:** build the smallest approved context pack.
3. **Worker:** research and create a draft or isolated local change.
4. **Functional review:** check correctness against the task and domain standards.
5. **Adversarial review:** challenge assumptions, security, abuse cases, and failure modes when risk warrants it.
6. **Approval:** Marco decides protected or external actions.
7. **Promotion:** perform only the exact approved action.
8. **Receipt:** record result, evidence, usage, blockers, and next action.

Low-risk work may combine review stages. High-risk work must preserve independent worker, reviewer, adversarial reviewer, approver, and promoter boundaries.

## Active Agent Loop

The operational implementation of this lifecycle is `operations/loops/agent-loop-v2.md`.

Agents should use the v2 loop for meaningful work, especially tasks that require persistence, reusable learning, or cross-agent coordination.
