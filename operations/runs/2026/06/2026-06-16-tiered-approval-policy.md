---
owner: harness-orchestrator
status: implemented
data_class: internal
updated: 2026-06-16
---

# Tiered Approval Policy

## Scope

Added a tiered approval policy so Systems Hub OS v2 can avoid treating every request as equally risky.

## Implemented

- Added `operations/approvals/policy.md`.
- Added approval-tier classification to Telegram envelopes.
- Updated envelope inspection to show tier and approval type.
- Migrated the existing test envelope to include `approval_tier`.

## Tiers

- Tier 0: intake/classification only.
- Tier 1: light approval for low-risk internal work.
- Tier 2: strong approval for product, code, security, payment, finance-structure, or user-data work.
- Tier 3: protected per-item approval for external, financial, legal, production, credential, scheduler, routing, or governance actions.

## Verified

- Syntax checks passed for the Telegram router and CLI.
- Existing envelope inspection shows `tier_0_intake`.
- Router output now includes `tier=tier_0_intake`.

## Boundary

This does not enable automatic execution. It only classifies captured work so future execution can be gated by the right approval level.
