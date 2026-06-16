---
owner: harness-orchestrator
status: implemented
data_class: internal
updated: 2026-06-16
---

# Telegram Reply Delivery

## Scope

Added explicit reply delivery for completed Telegram light-run envelopes.

## Implemented

- `runtime/scripts/telegram-reply.mjs`
- `hub telegram reply <envelope-id> --from-output latest --dry-run`
- `hub telegram reply <envelope-id> --from-output latest`
- Envelope inspection now shows a reply preview command after a light run completes.

## Verified

- Syntax checks passed for the reply script and CLI.
- Dry-run generated a Telegram reply from the latest passing `daily-agent-recap` output.
- The dry-run did not send a Telegram message.

## Boundary

Reply delivery is explicit and manual. It requires a completed light-run envelope and sends only the latest saved output for that envelope's executed task back to the original Telegram chat.
