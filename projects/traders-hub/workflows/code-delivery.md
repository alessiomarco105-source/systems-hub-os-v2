---
owner: harness-orchestrator
reviewers:
  - traders-hub-engineer
  - cto
status: canonical
data_class: internal
project: traders-hub
updated: 2026-06-15
review_after: 2026-07-01
sources:
  - legacy:wiki/systems-hub/operations/harness/projects/traders-hub/code-delivery.md
---

# Code Delivery Workflow

1. Verify repository root, remote, branch, and working tree.
2. Create a task envelope with allowed paths and protected areas.
3. Work only in an isolated task branch or workspace.
4. Run workflow verification, lint, build, secret scan, protected-path scan, dependency review, and product-specific checks.
5. Perform functional and adversarial review according to risk.
6. Stop for Marco's exact commit, push, merge, deployment, or production approval.
7. Promote only the reviewed commit from the canonical GitHub remote.
8. Record commit SHA, deployment evidence, checks, and residual risk.

## Required Commands

```bash
git rev-parse --show-toplevel
git remote get-url origin
git branch --show-current
git status --short
npm run verify:workflows
npm run lint
npm run build
```

The runtime adapter will supply the v2 project delivery gate after the legacy script is ported and reviewed.
