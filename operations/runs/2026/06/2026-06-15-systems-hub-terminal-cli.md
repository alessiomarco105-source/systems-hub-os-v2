# Run Receipt — Systems Hub Terminal CLI

Date: 2026-06-15
Agent: COS-Business / Harness Orchestrator
Approval: `approved: build Systems Hub terminal CLI and dynamic review workflow`

## Result

Built and installed the local `hub` terminal command as the approved entry point for Systems Hub model work.

## Commands

- `hub list`
- `hub status`
- `hub costs [--days N]`
- `hub validate [task-id]`
- `hub run <task-id> [--input "..."] [--review]`
- `hub review latest [task-id]`

## Dynamic Input Controls

- maximum 2,000 characters;
- likely credential detection before execution;
- no changes to provider, model, context, data class, tools, budgets, output contract, or approval boundary;
- effective manifest generated as an ephemeral file and removed after execution;
- exact effective manifest saved with the run output;
- manifest and prompt SHA-256 values recorded in the receipt.

## Dynamic Review

The CLI:

1. selects only the latest passing standard-task receipt;
2. verifies the worker output hash;
3. verifies and loads the effective worker manifest snapshot;
4. includes the worker role and approved source inventory;
5. creates a separate DeepSeek V4 Pro reviewer session;
6. writes a linked reviewer output and receipt;
7. keeps Marco review mandatory.

## Verification

- command works through `~/.local/bin/hub` from outside the repository;
- all canonical manifests validate without an API call;
- likely-secret input is rejected;
- draft Security Review execution is rejected;
- failed worker validation prevents automatic review;
- latest-review selection ignores failed worker receipts;
- runtime overlays are deleted;
- manifest snapshots match recorded hashes;
- synthetic sandbox regression passes.

## Quality Finding

The dynamic reviewer correctly used the worker's effective contract to distinguish a requested Top Three compression from unauthorized priority removal. It also surfaced real factual and decision-framing issues.

Reviewer outputs remain stochastic. A later review missed one launch-proof gap that an earlier review caught. The known gap was therefore moved into deterministic section validation. Independent review supplements, but does not replace, deterministic checks or Marco's judgment.

## Boundaries

- No scheduler or Telegram integration was changed.
- No write, commit, deploy, publish, payment, or external-action mode exists.
- No cloud or unattended runner was enabled.
- Static routine manifests do not yet discover recent receipts or analytics exports automatically.
