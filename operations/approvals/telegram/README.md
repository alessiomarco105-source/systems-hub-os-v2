# Telegram Approval Envelopes

Inbound messages from `@Systemshub_bot` can be captured here as local task envelopes.

Envelope capture is not execution. Each envelope starts as `pending_marco_approval`, receives an initial approval tier from `operations/approvals/policy.md`, and cannot:

- run a model;
- write files;
- send Telegram replies;
- execute commands;
- commit code;
- publish, pay, deploy, or schedule work.

Use:

```bash
hub telegram router --limit 5 --create-envelope
hub telegram envelopes
hub telegram envelope <envelope-id>
```

Running the routed agent requires a separate Marco approval. The approval syntax should match the envelope tier:

- `approved: light <envelope-id>` for low-risk internal work;
- `approved: strong <envelope-id>` for product, security, payment, user-data, finance-structure, or code work;
- `approved: protected <exact action>` for public, financial, legal, production, credential, scheduler, routing, or governance actions.
