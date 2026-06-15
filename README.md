# Systems Hub OS v2

Provider-neutral operating system for Systems Hub LLC.

This directory is being built in parallel with the current workspace. The legacy system remains untouched and operational until v2 passes migration, security, and workflow validation.

## Design

```text
governance/    protected company authority and safety rules
agents/        canonical role definitions and registry
capabilities/  reusable company functions
company/       strategy, portfolio, operations, and brand
projects/      isolated project packages
operations/    jobs, decisions, approvals, reports, and run evidence
runtime/       provider adapters, scripts, schemas, and generated config
knowledge/     reviewed reusable knowledge and references
migration/     inventory, classification, and migration evidence
archive/       retired canonical material
private/       local restricted data; ignored except its README
```

## Core Rule

Pi, Codex, Claude, DeepSeek, GPT, and future systems are replaceable workers. They do not own company governance, permissions, memory, or project truth.

## Current Status

- Structure: active build
- Canonical governance: seeded
- Agent registry: seeded
- Company operating context: consolidated
- Trader's Hub project package: consolidated
- Provider-neutral recurring jobs: defined
- Legacy migration: inventory and first consolidation pass
- Pi installation: not started
- DeepSeek connection: not started

## Migration Safety

- No legacy file is moved or deleted during the inventory stage.
- No secret is copied into v2.
- Generated and temporary assets are excluded from model context.
- The legacy workspace remains the operational rollback until v2 is approved.

## Terminal

The local `hub` command is the approved terminal entry point:

```bash
hub status
hub list
hub run weekly-business-review
hub run cos-business-executive-brief --input "Focus on launch decisions" --review
hub review latest cos-business-executive-brief
hub costs --days 30
hub tokens --days 7 --limit 10
hub tui
```

Do not launch raw `pi` inside company or project repositories. `hub` preserves manifest, sandbox, validation, receipt, and review gates.

Use raw `pi` only for manual, explicitly bounded exploration. Project-local `pi-context-tools` is installed for manual sessions so an agent can inspect context usage and compact long sessions, but `hub` intentionally disables Pi extensions during governed task runs.

`hub tui` opens the zero-dependency terminal interface for running tasks, reviewing latest outputs, checking token usage, viewing receipts, and validating manifests without memorizing every command.
