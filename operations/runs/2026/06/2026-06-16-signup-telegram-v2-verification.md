---
owner: harness-orchestrator
status: verified
data_class: internal
updated: 2026-06-16
---

# Signup Telegram v2 Verification

## Result

The v2 Telegram adapter successfully sent a test message through the `signup` channel.

## Evidence

- Command: `node runtime/scripts/telegram-notify.mjs --channel signup --text "[test message]"`
- Runtime result: `Telegram sent channel=signup`
- Bot/channel mapping: `signup` maps to `Trader'sHub_alerts_bot`
- Credential storage: macOS Keychain

## Safety

- No bot token or chat id was written to the repository.
- The visible bot token previously pasted during setup should be rotated in BotFather after migration testing is complete.
