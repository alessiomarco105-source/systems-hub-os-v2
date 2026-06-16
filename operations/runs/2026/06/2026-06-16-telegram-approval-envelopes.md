---
owner: harness-orchestrator
status: implemented
data_class: internal
updated: 2026-06-16
---

# Telegram Approval Envelopes

## Scope

Added local approval-envelope capture for inbound `@Systemshub_bot` messages.

## Implemented

- `hub telegram router --limit N --create-envelope`
- `hub telegram envelopes`
- Local envelope storage under `operations/approvals/telegram/`
- Default permission block on captured envelopes
- Duplicate-safe envelope creation for repeated Telegram updates

## Verified

- A test Telegram message was captured as a `pending_marco_approval` envelope.
- The envelope routed to `harness-orchestrator`.
- The envelope explicitly disallows model runs, file writes, replies, command execution, commits, publishing, payments, deployments, and scheduling.
- Re-running capture on the same Telegram update reports `already_exists` instead of failing.

## Boundary

This is intake only. It does not execute routed agents yet.
