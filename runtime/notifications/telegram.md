---
owner: harness-orchestrator
status: draft-adapter
data_class: internal
updated: 2026-06-16
---

# Telegram Adapter

Runtime script: `runtime/scripts/telegram-notify.mjs`
Health script: `runtime/scripts/telegram-health.mjs`
Interactive router scaffold: `runtime/scripts/telegram-router.mjs`

## Channels

| Channel | Telegram bot | Use | Bot token source | Chat id source |
|---|---|---|---|---|
| operations | Systems Hub operations bot | Daily recaps, weekly reviews, agent operations alerts | `SYSTEMS_HUB_TELEGRAM_OPERATIONS_BOT_TOKEN` or Keychain `systems-hub-telegram-operations-bot-token` | `SYSTEMS_HUB_TELEGRAM_OPERATIONS_CHAT_ID` or Keychain `systems-hub-telegram-operations-chat-id` |
| social | Systems Hub social KPI bot | Social media performance reports and content KPI alerts | `SYSTEMS_HUB_TELEGRAM_SOCIAL_BOT_TOKEN` or Keychain `systems-hub-telegram-social-bot-token` | `SYSTEMS_HUB_TELEGRAM_SOCIAL_CHAT_ID` or Keychain `systems-hub-telegram-social-chat-id` |
| signup | `Trader'sHub_alerts_bot` | Trader's Hub beta/signup alerts that require Marco review | `SYSTEMS_HUB_TELEGRAM_SIGNUP_BOT_TOKEN` or Keychain `systems-hub-telegram-signup-bot-token` | `SYSTEMS_HUB_TELEGRAM_SIGNUP_CHAT_ID` or Keychain `systems-hub-telegram-signup-chat-id` |
| interactive | `@Systemshub_bot` | Inbound owner messages routed into governed agent task envelopes | `SYSTEMS_HUB_TELEGRAM_INTERACTIVE_BOT_TOKEN` or Keychain `systems-hub-telegram-interactive-bot-token` | `SYSTEMS_HUB_TELEGRAM_INTERACTIVE_CHAT_ID` or Keychain `systems-hub-telegram-interactive-chat-id` |

## Current Credential Status

- `operations`: configured in the v2 Keychain and tested.
- `social`: configured in the v2 Keychain and tested.
- `signup`: configured in the v2 Keychain. This channel maps to `Trader'sHub_alerts_bot`.
- `interactive`: configured in the v2 Keychain. Read/routing check passed with a test message routed to `harness-orchestrator`; task-envelope execution is not activated yet.

## Safety

- No token or chat id is stored in the repository.
- `--dry-run` prints the intended message without network delivery.
- Actual sends require explicit command execution and valid secrets.
- Product signup notifications may continue to run from the Trader's Hub product stack until the signup channel is verified in v2.
- Run `hub telegram health` to inspect local credential readiness without printing secrets.
- Run `hub telegram router --dry-run` to verify the inbound router scaffold without fetching Telegram updates.
- Run `hub telegram router --limit 5 --create-envelope` to capture recent inbound messages as pending local approval envelopes.
- Run `hub telegram envelopes` to list captured envelopes.
