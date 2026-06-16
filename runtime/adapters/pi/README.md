# Pi Adapter

Use `terminal-guide.md` for Marco-facing terminal usage.

Systems Hub prefers the `hub` CLI for governed Pi/DeepSeek work. Raw `pi` remains available for manual experiments, but it does not automatically enforce Systems Hub task manifests, receipts, or approval boundaries.

Status: installed, provider connection verified, restricted pilot operational; production adapter not configured.

Installed version: `0.79.4`
Executable: `/Users/ciccio/.nvm/versions/node/v24.14.0/bin/pi`
Verified provider: DeepSeek
Verified model: `deepseek-v4-flash`

Planned responsibilities:

- load the minimal global `AGENTS.md`;
- select canonical role and project context per task;
- enforce path and provider policy through the runner;
- expose reviewed skills only;
- record token/cost usage and receipts.

Pi packages and extensions must be security-reviewed and version-pinned before activation.

The DeepSeek credential remains in macOS Keychain and is injected only into the launched process. Project access, tools, skills, extensions, and unattended execution are not configured.

## Restricted Pilot Launcher

`runtime/scripts/pi-restricted-launcher.sh` provides the first local gate:

- explicit per-file context allowlist;
- ephemeral copied workspace;
- rejection of secret-like filenames and symlinks;
- 256 KiB limit per context file;
- macOS sandbox denial of user, mounted-volume, and temporary data outside the staged workspace;
- read-only Pi tool allowlist;
- no sessions, extensions, skills, prompt templates, themes, or context discovery;
- DeepSeek key injection from macOS Keychain for the child process only.

Run the synthetic verification with:

```bash
runtime/scripts/verify-pi-restricted-launcher.sh
```

System runtime files remain readable because Node and Pi require them. This is a local pilot boundary, not yet an unattended production runner. Network egress is currently allowed so Pi can reach DeepSeek; endpoint-specific network restriction and container-grade isolation remain future work.

## First Real Context Test

On 2026-06-15, DeepSeek V4 Flash completed a read-only COS-Business brief using four explicitly allowed internal files. The filesystem and tool boundary passed. Human review found one semantic overstatement: "only active product project" became "single-product company." Runtime safety and answer quality therefore remain separate gates.

## Task Contracts and Usage

`runtime/scripts/run-task-manifest.mjs` now:

- accepts manifests only from `operations/tasks/`;
- rejects unexpected fields, unsafe paths, unsupported models, non-read-only tools, and private/protected data in the current pilot;
- verifies file-level `data_class` metadata and aggregate context size;
- executes through the restricted launcher in Pi JSON mode;
- extracts provider-reported input, output, cache, total-token, and cost data;
- validates headings, visible word count, required and forbidden patterns, section-specific rules, stop reason, and post-run budgets;
- writes an immutable output artifact and SHA-256-linked JSON receipt;
- keeps human review mandatory even when deterministic checks pass.

`context-mode` has not been installed. It may later optimize long-session context after source review, but provider usage events remain the accounting source of truth.

`pi-context-tools` is installed project-locally for manual Pi sessions only:

```bash
pi list --approve
pi --approve
```

The package exposes:

- `context_info` — report current interactive-session context usage;
- `compact_context` — compact the current interactive session after the turn.

The package is not loaded by `hub` because the restricted launcher passes `--no-extensions`. This preserves deterministic task manifests, receipts, and sandbox behavior for official Systems Hub runs.

## Independent Review Gate

The independent reviewer:

- uses a dedicated canonical role;
- starts a new provider session;
- receives the worker output only through a verified receipt;
- checks the worker output hash before any review call;
- evaluates factual support, omissions, priorities, scope, risk, and decisions;
- produces its own usage receipt linked to the worker receipt;
- cannot approve promotion or remove Marco's review requirement.

DeepSeek V4 Pro is used for the pilot reviewer because Flash repeatedly failed a simple formatting gate and produced shallower omission analysis. The successful Pro review cost `$0.003680651`.

## Terminal Entry Point

Use `hub`, not raw `pi`, for company work. The CLI:

- resolves canonical task IDs;
- creates bounded dynamic-input overlays;
- rejects likely secrets before a provider call;
- blocks draft tasks;
- runs through the existing restricted launcher;
- discovers the latest passing worker receipt;
- builds an independent Pro review with worker sources, role, effective manifest, output, and receipt;
- records immutable manifest and prompt hashes;
- reports status and aggregate provider costs.
- reports token-efficiency audit data through `hub tokens --days N --limit N`.

The command is linked at `~/.local/bin/hub` and works from any directory. It does not enable writing, scheduling, Telegram, cloud execution, or external actions.
