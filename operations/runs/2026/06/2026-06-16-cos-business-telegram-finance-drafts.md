---
owner: harness-orchestrator
status: draft
data_class: internal
date: 2026-06-16
---

# COS-Business Telegram Finance Draft Path

## Result

Added a draft-safe path for COS-Business expense and revenue logging from Telegram.

## What Changed

- Added `hub telegram finance-draft <envelope-id> [--dry-run]`.
- Added `hub finance drafts`.
- Added `hub finance draft <draft-id>`.
- Added draft storage under `operations/finance/drafts/telegram/`.
- Documented the promotion boundary in finance and Telegram approval docs.
- Added `hub finance promote <draft-id> --approved` after the first approved promotion request.

## Boundary

The capture workflow creates local draft records only. It does not update final finance books, revenue scoreboards, taxes, payments, statements, or external systems.

Final booking requires explicit promotion approval and writes to the internal monthly JSONL ledger. It still does not decide tax treatment.

## Review Notes

Trading-related costs are marked as `trading_edge_refinement` for review instead of automatically treating them as Systems Hub LLC tax expenses.
