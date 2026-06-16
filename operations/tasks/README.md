# Task Manifests

Each model run starts from a reviewed JSON manifest.

Manifests declare:

- role and scope;
- provider and model;
- exact context files and data classes;
- tool and action permissions;
- pre-run context limits;
- post-run token and cost budgets;
- required output structure;
- deterministic validation rules.

JSON is used because it is natively parseable and validates cleanly against JSON Schema. Agents may present a YAML view to humans, but the executed artifact must be JSON.

Run a reviewed task:

```bash
node runtime/scripts/run-task-manifest.mjs \
  operations/tasks/cos-business-executive-brief.json
```

The runner writes:

- the model output under `operations/runs/usage/YYYY/MM/`;
- a JSON receipt beside it with token usage, cost, context files, hash, validation failures, and promotion status.

A validator pass never removes the human-review requirement.

## Independent Review

Review manifests use `task_kind: review` and reference a completed worker receipt.
Before contacting the reviewer model, the runner verifies:

- worker task identity;
- worker validation status when required;
- worker output location;
- worker output SHA-256 against its receipt.

The reviewer runs in a new Pi session with a different role and prompt. It cannot modify the worker output or approve promotion. A reviewer pass means the artifact may proceed to Marco's review.

## Core Routines

| Routine | V2 state |
|---|---|
| Weekly Business Review | v2 dry-run adapter ready; schedule not activated |
| Daily Agent Recap | v2 dry-run adapter ready; schedule not activated |
| Social KPI Report | v2 dry-run adapter ready; schedule not activated |
| Security Exposure Review | draft; protected-data provider approval required |

V2 Telegram delivery is locally available for approved manual sends. No unattended v2 schedule is active yet; legacy Codex automations remain active until cutover verification passes.

## Terminal CLI

`hub` is installed locally through:

`~/.local/bin/hub`

Available commands:

| Command | Purpose |
|---|---|
| `hub list` | Show canonical tasks, state, and model |
| `hub validate [task]` | Validate one or all manifests without an API call |
| `hub run <task>` | Run a manual task through the restricted runtime |
| `hub run <task> --input "..."` | Add a bounded task focus without changing permissions or context |
| `hub run <task> --review` | Run the worker, then review the latest passing receipt |
| `hub review latest [task]` | Review the latest passing standard-task receipt |
| `hub costs --days N` | Aggregate provider-reported tokens and cost |
| `hub tokens --days N --limit N` | Audit token use, failed-run waste, review share, and most expensive runs |
| `hub jobs` | Show recurring job migration status |
| `hub job <job> --dry-run` | Verify a v2 job envelope without model or Telegram side effects |
| `hub telegram health` | Show Telegram credential readiness without printing secrets |
| `hub telegram router --dry-run` | Verify the inbound bot router without reading updates |
| `hub telegram router --limit 5 --create-envelope` | Capture recent inbound messages as pending local approval envelopes |
| `hub telegram envelopes` | List captured Telegram approval envelopes |
| `hub telegram envelope <id>` | Inspect one captured envelope and its approval boundary |
| `hub telegram finance-draft <id> --dry-run` | Preview draft finance capture from a COS-Business Telegram envelope |
| `hub telegram finance-draft <id>` | Create a local draft finance record without updating final books |
| `hub telegram run-light <id> --dry-run` | Preview a light-approved envelope run without spending tokens |
| `hub telegram run-light <id>` | Run a Tier 0/Tier 1 envelope through a mapped read-only task |
| `hub telegram reply <id> --from-output latest --dry-run` | Preview a Telegram reply from the latest saved output |
| `hub telegram reply <id> --from-output latest` | Send the latest saved output to the original Telegram chat |
| `hub tui` | Open the interactive terminal interface |
| `hub status` | Show repository, Pi, key, task, receipt, and activation state |
| `hub finance drafts` | List draft finance captures |
| `hub finance status` | Show pending finance envelopes, pending drafts, booked drafts, and current-month totals |
| `hub finance draft <id>` | Inspect a draft finance capture and its promotion boundary |
| `hub finance promote <id> --approved` | Promote an approved draft into the internal monthly finance ledger |
| `hub finance confirm <id>` | Preview a Telegram confirmation for a draft or booked entry |
| `hub finance confirm <id> --send` | Send the confirmation back to the source Telegram chat |
| `hub finance month YYYY-MM` | List booked ledger entries for one month |
| `hub finance totals --month YYYY-MM` | Summarize revenue, expenses, and net by currency and lane |
| `hub finance export --month YYYY-MM --format csv` | Export one month of booked ledger entries to local CSV |
| `hub loop` | Print the active Agent Loop v2 standard |
| `hub loop-check <receipt.json>` | Inspect a run receipt against mechanical Agent Loop v2 evidence |
| `hub pi-guide` | Print the Pi/DeepSeek terminal usage guide |

Dynamic input:

- is capped at 2,000 characters;
- is scanned for likely credentials;
- cannot change context files, tools, model, budgets, output contract, or approvals;
- is stored only inside the immutable effective-manifest snapshot for audit;
- produces an `ephemeral_manifest: true` receipt.

The CLI removes runtime overlays after execution and ignores abandoned overlays in Git.

The TUI is a convenience layer over the same commands. It does not add write, publish, schedule, deploy, or external-action powers. Dashboard, agent-router, agent-registry, next-action, output, receipt, task, and token views are local inspection screens. `Run Task` and `Review Latest` are the only TUI entries that can call a model, and they still use the restricted runtime. The TUI may reuse project-local Pi theme colors from `.pi/settings.json`, but `hub` still launches governed model work with Pi extensions disabled. Use arrow keys or `j`/`k` to move, number keys to jump (`0` selects item 10), Enter to open an action, `r` to refresh, and `q` to quit.

Token discipline:

- run `hub validate` before spending API tokens after editing manifests;
- use `--review` only for decision-grade outputs;
- prefer shorter `--input` text because dynamic input is appended to the prompt;
- use `hub tokens --days 7` after calibration sessions to identify failed-run waste.
