# Finance Operations

Finance operations keep draft-safe capture separate from final books.

## Current State

- Telegram finance capture is draft-only.
- Drafts live under `operations/finance/drafts/telegram/`.
- A draft does not update accounting ledgers, tax records, financial statements, or revenue scoreboards.
- Final booking requires a separate explicit promotion approval and `hub finance promote <draft-id> --approved`.

## Telegram Draft Workflow

1. Marco sends an expense or revenue message to `@Systemshub_bot`.
2. The router captures it as a locked Telegram envelope:

```bash
hub telegram router --limit 5 --create-envelope
```

3. Inspect the envelope:

```bash
hub telegram envelope <envelope-id>
```

4. After Marco gives light approval for the envelope, create a finance draft:

```bash
hub telegram finance-draft <envelope-id> --dry-run
hub telegram finance-draft <envelope-id>
```

5. Review drafts:

```bash
hub finance drafts
hub finance draft <draft-id>
```

6. Promote only after explicit approval:

```bash
hub finance promote <draft-id> --approved
```

## Promotion Boundary

Drafts include this approval syntax:

```text
approved: promote finance draft <draft-id>
```

Promotion appends one JSON ledger entry under `operations/finance/ledger/YYYY/MM.jsonl`, marks the draft as `booked`, and marks the source Telegram envelope as `finance_draft_promoted`.

Promotion does not decide tax treatment. Ledger entries currently set `tax_treatment_reviewed: false`.

## Monthly Review

Use these commands to inspect and export booked records:

```bash
hub finance status
hub finance month 2026-06
hub finance totals --month 2026-06
hub finance export --month 2026-06 --format csv
```

CSV exports are written under `operations/finance/exports/` and are ignored by Git.

## Telegram Confirmation

Preview a confirmation message:

```bash
hub finance confirm <draft-id>
```

Send it only after explicit approval:

```bash
hub finance confirm <draft-id> --send
```

## Control Rules

- Do not infer tax treatment from a Telegram message.
- Trading-related challenge fees are marked as `trading_edge_refinement` for review, not automatically booked as Systems Hub LLC expenses.
- Missing amount, unclear type, or uncertain category must stay marked for review.
- Drafts with review notes cannot be promoted until reviewed and corrected.
- A draft cannot be promoted twice.
- Never include secrets, card numbers, bank details, or full customer records in Telegram finance messages.
