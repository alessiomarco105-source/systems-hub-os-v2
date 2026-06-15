# Run Receipt — Hub TUI App Layout

Date: 2026-06-16
Agent: COS-Business / Harness Orchestrator
Approval: `approved: design and build hub tui`

## Result

Upgraded `hub tui` from a prompt-style menu into a full-screen app-like terminal interface.

## Changes

- Added full-screen ANSI layout with persistent header and sidebar navigation.
- Added dashboard cards for runtime status, token usage, and last run.
- Added app views for tasks, token audit, recent receipts, run action, review action, and validation.
- Added keyboard navigation:
  - arrows or `j`/`k` move;
  - number keys jump to a view;
  - Enter opens an action;
  - `r` refreshes;
  - `q` quits.
- Preserved existing `hub` commands and runtime gates.

## Verification

- `node --check runtime/scripts/hub-cli.mjs` passed.
- `git diff --check` passed.
- `hub help`, `hub list`, and `hub tokens --days 2 --limit 2` still work.
- `hub tui` opened in a real TTY.
- Navigated to Tasks, Token Audit, Receipts, and Validate.
- Validate ran successfully inside the TUI without an API call.

## Boundaries

- No third-party TUI dependency was added.
- No write, publish, schedule, deploy, Telegram, payment, or external-action path was added.
- API-spending actions remain explicit: `Run Task` and `Review Latest`.
