# Pi Adapter

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
