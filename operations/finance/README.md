# Finance Operations

Finance operations keep draft-safe capture separate from final books.

## Current State

- Telegram finance capture is draft-only.
- Drafts live under `operations/finance/drafts/telegram/`.
- A draft does not update accounting ledgers, tax records, financial statements, or revenue scoreboards.
- Final booking requires a separate explicit promotion approval.

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

## Promotion Boundary

Drafts include this approval syntax:

```text
approved: promote finance draft <draft-id>
```

That approval is not implemented as an automatic ledger write yet. Until a controlled ledger promotion command exists, COS-Business should review the draft and manually update the approved finance book through the existing accounting workflow.

## Control Rules

- Do not infer tax treatment from a Telegram message.
- Trading-related challenge fees are marked as `trading_edge_refinement` for review, not automatically booked as Systems Hub LLC expenses.
- Missing amount, unclear type, or uncertain category must stay marked for review.
- Never include secrets, card numbers, bank details, or full customer records in Telegram finance messages.
