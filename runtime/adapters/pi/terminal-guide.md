---
owner: harness-orchestrator
status: active-guide
data_class: internal
updated: 2026-06-16
---

# Pi Terminal Guide

Pi in the terminal is not a chat interface like Codex Desktop. Treat it more like a command-line worker.

For day-to-day Systems Hub work, prefer `hub` over raw `pi`.

## Mental Model

| Surface | Best use |
|---|---|
| Codex Desktop | collaborative building, explanations, file edits, long sessions |
| `hub` CLI | governed Systems Hub tasks, routines, receipts, Telegram, finance |
| raw `pi` | manual experiments and direct model work when you know the context boundary |

## Start Here

Use these commands first:

```bash
cd "/Users/ciccio/AI Assistant/systems-hub-os-v2"
hub status
hub list
hub jobs
hub finance status
hub tui
```

## Run A Governed Task

```bash
hub run cos-business-executive-brief --input "Give me current priorities and blockers."
```

With independent review:

```bash
hub run weekly-business-review --input "Focus on first revenue risk." --review
```

## Run A Routine Job

```bash
hub job daily-agent-recap --dry-run
hub job daily-agent-recap --notify
```

## Check Tokens And Cost

```bash
hub tokens --days 7
hub costs --days 30
```

## Telegram

```bash
hub telegram health
hub telegram router --limit 5 --create-envelope
hub telegram envelopes
```

## Finance

```bash
hub finance status
hub finance drafts
hub finance month 2026-06
hub finance totals --month 2026-06
```

## Raw Pi

Use raw Pi only for manual experiments. It will not automatically know the Systems Hub approval layers unless you give it context.

Typical pattern:

```bash
cd "/Users/ciccio/AI Assistant/systems-hub-os-v2"
pi
```

Then paste a small instruction and point it to specific files. Do not paste secrets.

For governed business operations, use `hub` because it:

- limits context files;
- records receipts;
- enforces validation;
- uses the restricted launcher;
- keeps approvals visible;
- tracks token/cost usage.
