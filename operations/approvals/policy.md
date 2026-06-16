# Approval Policy

Systems Hub OS v2 uses tiered approval so routine work can move quickly while protected actions remain gated.

## Tier 0: Intake

Allowed without Marco approval:

- capture an inbound Telegram message as an envelope;
- classify the likely owner agent;
- list or inspect pending envelopes;
- draft local plans, summaries, or options without external action.

Never allowed in Tier 0:

- model execution from Telegram;
- file writes outside envelope capture;
- Telegram replies;
- external sends, posts, payments, deployments, commits, or scheduling.

## Tier 1: Light Approval

Allowed after a simple Marco approval when the request is explicit and low-risk:

- log an expense or revenue item Marco directly stated;
- create a draft finance capture from a locked Telegram envelope;
- run a read-only report;
- create a draft content asset;
- create a local internal task;
- summarize provided content;
- send Marco an internal Telegram recap.

Example syntax:

```text
approved: light <task-or-envelope-id>
```

## Tier 2: Strong Approval

Required for business or product actions with meaningful risk:

- changing product code;
- modifying design implementation;
- touching user data;
- editing finance workbooks beyond explicit owner-stated entries;
- promoting finance drafts into final books when category, lane, or tax treatment is uncertain;
- changing payment setup;
- changing auth, RLS, security, legal, privacy, or terms;
- running security tests;
- committing code;
- activating schedules.

Example syntax:

```text
approved: strong <task-or-envelope-id>
```

## Tier 3: Per-Item Protected Approval

Always requires explicit per-item approval:

- public posts;
- outreach or user/customer messages;
- payments or purchases;
- production deploys;
- deletion of data;
- credential rotation;
- legal/privacy/payment text changes;
- harness core, agent authority, routing, scheduler, or security policy changes.

Example syntax:

```text
approved: protected <exact action>
```

## Default Rule

If a task is ambiguous, classify it one tier higher. If it involves external consequences, user data, money, security, legal, production, or public reputation, it cannot be auto-executed.
