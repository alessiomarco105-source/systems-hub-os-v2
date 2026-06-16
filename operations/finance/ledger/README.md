# Finance Ledger

Internal finance ledger entries live here as monthly JSONL files:

```text
operations/finance/ledger/YYYY/MM.jsonl
```

Each line is one `systems_hub.finance_ledger_entry/v1` record.

## Boundary

This ledger is an internal operating record. It is not a tax filing, bank feed, payment processor export, or accountant-approved statement.

Tax treatment remains unreviewed unless a record explicitly states otherwise.
