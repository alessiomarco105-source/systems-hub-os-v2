# Agent Loops

Agent loops define how Systems Hub agents move from a request to a finished, reviewable result.

The active standard is:

- `agent-loop-v2.md`

Loop standards are provider-neutral. They apply whether the worker is Codex, Pi, Claude Code, or another model surface.

## Commands

```bash
hub loop
hub loop-check operations/runs/usage/YYYY/MM/<receipt>.json
```

`loop-check` is mechanical. It checks receipt evidence, not semantic truth. Decision-grade outputs still need human or independent review.
