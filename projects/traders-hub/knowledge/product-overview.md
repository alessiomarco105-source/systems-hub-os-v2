---
owner: traders-hub-engineer
status: canonical
data_class: internal
project: traders-hub
updated: 2026-06-15
review_after: 2026-07-01
sources:
  - legacy:wiki/traders-hub/overview.md
  - repo:README.md
  - repo:docs/ARCHITECTURE.md
  - repo:docs/PAGES.md
---

# Trader's Hub Product Overview

## Product

Trader's Hub, publicly branded as The Trader System, is a web application that helps traders follow a repeatable process across the full trading day:

```text
pre-market preparation
→ live-session accountability
→ trade or no-trade logging
→ post-session review
→ weekly and period reviews
→ analytics and lessons
```

## Position

The product helps traders execute and review systems they already have. It is not a signal service, strategy seller, or profitability promise.

## Target User

The primary early user is an intraday or prop-firm trader who already has a strategy but struggles with preparation, rule adherence, emotional execution, and consistent review.

## Core Product Areas

- Trading Desk: daily, weekly, and monthly preparation
- Trade capture: manual and CSV-assisted logging
- Review: daily, weekly, monthly, quarterly, and yearly
- Performance Lab: analytics, calendar, lessons, and reporting
- Control Center: strategies, discipline, risk, accounts, and setup
- Access: beta approval and subscription entitlement

## Product Repository

- Local: `/Users/ciccio/Desktop/Codex/TradersHub-Codex`
- Remote: `https://github.com/alessiomarco105-source/TradersHub.git`
- Source of truth: product repository and its own documentation

The Systems Hub project package governs business context, workflows, security, and launch evidence. It does not duplicate the application source code.
