# Hub TUI Agent Access

Date: 2026-06-16
Scope: Add quick local access to Systems Hub agents inside `hub tui`.

## Built

- Added an `Agent Router` view.
- Added an `Agents` registry view.
- Loaded agent metadata from `agents/registry.yaml`.
- Marked `harness-orchestrator` as the default first contact when ownership is unclear.

## Safety

- The views are local inspection only.
- No agent is launched automatically.
- No scheduler, Telegram, model, write permission, external action, or approval rule was changed.

## Verification

- `node --check runtime/scripts/hub-cli.mjs` passed.
- `git diff --check` passed.
- `hub validate` passed for all task manifests.
- `hub tui` rendered `Agent Router`.
- `hub tui` rendered `Agents`.
- TUI exited cleanly with `q`.

## Follow-Up

- Add internal scrolling or a compact-logo mode so the full agent registry is visible in standard terminal height.
- Add a governed task-envelope creator after the routing view is reviewed.
