# Run Receipt — Token Efficiency and Pi Context Tools

Date: 2026-06-16
Agent: COS-Business / Harness Orchestrator
Approval: `approved: build token efficiency audit and safe pi-context-tools integration`

## Result

Added local token-efficiency visibility and installed `pi-context-tools` for manual Pi sessions.

## Changes

- Installed `npm:pi-context-tools` project-locally under `.pi/`.
- Added project-local Pi compaction config with `keepRecentTokens: 1200`.
- Added `hub tokens [--days N] [--limit N]`.
- Updated `hub status` to report whether `pi-context-tools` is installed locally.
- Documented that `hub` keeps Pi extensions disabled for deterministic Systems Hub runs.

## Verification

- `pi list --approve` shows `npm:pi-context-tools`.
- Manual Pi test with only `context_info` available succeeded and reported a 2,336-token empty session.
- `node --check runtime/scripts/hub-cli.mjs` passed.
- `hub validate` passed for all manifests.
- `hub tokens --days 2 --limit 5` produced token audit output.

## Token Audit Finding

For the last two days:

- runs: 37;
- tokens: 309,427;
- cost: `$0.068043`;
- failed-run tokens: 165,129 (`53.4%`);
- failed-run cost: `$0.032156`;
- worker tokens: 165,393 (`53.5%`);
- review tokens: 144,034 (`46.5%`);
- cache-read tokens: 184,448 (`59.6%`).

Main efficiency problem: repeated failed calibration runs, not ordinary successful task usage.

## Boundaries

- `pi-context-tools` is for manual interactive Pi sessions only.
- `hub` still launches Pi with `--no-extensions`, `--no-skills`, `--no-prompt-templates`, and read-only tools.
- No scheduler, Telegram, write mode, cloud runner, posting, deployment, or external action was enabled.

## Next Efficiency Moves

1. Use `hub validate` before any model run after manifest edits.
2. Use `--review` only for decision-grade outputs.
3. Add a lower-cost smoke-test mode before full worker + reviewer cycles.
4. Consider a future compact reviewer input that passes only source excerpts and contract-critical fields.
