# Hub TUI Pi Theme Integration

Date: 2026-06-16
Approval: `Option 2`
Scope: Reuse the selected project-local Pi theme palette inside `hub tui` without expanding runtime permissions.

## Built

- Installed `npm:my-pi-themes` project-locally.
- Selected `onedark-pro` in `.pi/settings.json`.
- Added a theme loader to `hub tui`.
- Mapped Pi theme colors into the TUI header, sidebar, selected item, borders, cards, and status colors.
- Displayed the active theme in the TUI header.

## Safety

- The installed package was inspected before installation.
- The package contains theme JSON files only, with no declared runtime dependencies.
- Governed `hub` model runs still keep Pi extensions disabled.
- No task manifest, context allowlist, model budget, approval rule, or external-action permission was changed.

## Verification

- `npm view my-pi-themes` showed MIT license and no declared dependencies.
- The package tarball was inspected before installation.
- `pi install npm:my-pi-themes -l --approve` succeeded.
- Isolated Pi preview loaded available themes without model access.
- `node --check runtime/scripts/hub-cli.mjs` passed.
- `git diff --check` passed.
- `jq empty .pi/settings.json .pi/npm/package.json .pi/npm/package-lock.json` passed.
- `hub validate` passed for all task manifests.
- `hub tokens --days 2 --limit 1` still works.
- `pi list --approve` shows both local packages.
- `hub tui` rendered `theme=onedark-pro`, themed header, sidebar, boxes, status colors, and local views.
- `hub tui` rendered a dark full-width background.
- `hub tui` rendered a large `SYSTEMS HUB` ASCII wordmark in the top visual panel.
