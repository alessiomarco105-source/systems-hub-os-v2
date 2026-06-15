# Hub TUI Branded Viewers

Date: 2026-06-16
Approval: `go ahead and add those as well as some nice design/logo to the top with a big 'systems hub' words`
Scope: Improve the local Systems Hub terminal interface without expanding model, write, publish, deploy, schedule, or external-action powers.

## Built

- Added a persistent `SYSTEMS HUB` branded header to the TUI.
- Added a deterministic Recommended Next Action view.
- Added a local Run Output Viewer for the latest receipt output.
- Added a local Open Receipt detail view.
- Expanded the sidebar menu while preserving keyboard navigation.
- Kept model-spending actions limited to `Run Task` and `Review Latest`.

## Safety

- The new dashboard views read only local receipts and markdown outputs.
- No provider call is made by dashboard, next-action, output, receipt, task, token, or validation views.
- No permissions, model manifests, context allowlists, or approval gates were changed.

## Verification

- `node --check runtime/scripts/hub-cli.mjs` passed.
- `git diff --check` passed.
- `hub validate` passed for all task manifests.
- `hub help` still lists `hub tui`.
- `hub tokens --days 2 --limit 2` still works.
- `hub tui` opened in a real TTY.
- Dashboard, Recommended Next Action, Output Viewer, Receipt Detail, and Validate views rendered.
- `0` selected item 10 (`Validate`).
- `q` exited the TUI cleanly.
