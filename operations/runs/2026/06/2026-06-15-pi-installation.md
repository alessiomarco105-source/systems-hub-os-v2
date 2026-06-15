# Run Receipt — Pi Installation

Date: 2026-06-15
Agent: COS-Business / Harness Orchestrator
Approval: `okay installiamo pi`

## Result

Installed the official Pi coding-agent package globally:

- package: `@earendil-works/pi-coding-agent`;
- version: `0.79.4`;
- install mode: npm global with lifecycle scripts disabled;
- executable: `/Users/ciccio/.nvm/versions/node/v24.14.0/bin/pi`.

## Verification

- `pi --version` returned `0.79.4`;
- help output loaded correctly;
- the package is present in the active Node installation.

## Boundaries

- No DeepSeek API key was configured.
- No model request was made.
- Pi was not launched inside Systems Hub OS or Trader's Hub.
- No project context, tools, skills, extensions, or sessions were enabled.
- No repository commit or push was performed.
