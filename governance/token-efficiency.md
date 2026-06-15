---
owner: harness-orchestrator
status: canonical
data_class: internal
core_protected: true
updated: 2026-06-15
---

# Token Efficiency Policy

Use the minimum context and reasoning necessary for a correct, reviewable result.

1. Start with a compact control header.
2. Load the role, project manifest, and only task-relevant sections.
3. Prefer indexes, manifests, diffs, and validated summaries over full histories.
4. Expand context only for a named information gap.
5. Use deterministic scripts for filtering, counting, and validation.
6. Use lower-cost models for routing, extraction, and routine classification.
7. Escalate to stronger models for ambiguity, synthesis, risk, or repeated failure.
8. Record input, output, cached tokens, cost, retries, and context supplied when available.

Token savings never justify hiding material risk or skipping required evidence.
