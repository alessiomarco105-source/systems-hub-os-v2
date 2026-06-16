---
owner: harness-orchestrator
status: draft-adapter
data_class: internal
updated: 2026-06-16
---

# Telegram Adapter

Runtime script: `runtime/scripts/telegram-notify.mjs`

## Channels

| Channel | Bot token source | Chat id source |
|---|---|---|
| operations | `SYSTEMS_HUB_TELEGRAM_OPERATIONS_BOT_TOKEN` or Keychain `systems-hub-telegram-operations-bot-token` | `SYSTEMS_HUB_TELEGRAM_OPERATIONS_CHAT_ID` or Keychain `systems-hub-telegram-operations-chat-id` |
| social | `SYSTEMS_HUB_TELEGRAM_SOCIAL_BOT_TOKEN` or Keychain `systems-hub-telegram-social-bot-token` | `SYSTEMS_HUB_TELEGRAM_SOCIAL_CHAT_ID` or Keychain `systems-hub-telegram-social-chat-id` |

## Safety

- No token or chat id is stored in the repository.
- `--dry-run` prints the intended message without network delivery.
- Actual sends require explicit command execution and valid secrets.
