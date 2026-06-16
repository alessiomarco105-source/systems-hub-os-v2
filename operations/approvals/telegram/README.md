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
hub telegram run-light <envelope-id> --dry-run
hub telegram reply <envelope-id> --from-output latest --dry-run
```

Running the routed agent requires a separate Marco approval. The approval syntax should match the envelope tier:

- `approved: light <envelope-id>` for low-risk internal work;
- `approved: strong <envelope-id>` for product, security, payment, user-data, finance-structure, or code work;
- `approved: protected <exact action>` for public, financial, legal, production, credential, scheduler, routing, or governance actions.

## Light Execution

After Marco approves a light envelope, use:

```bash
hub telegram run-light <envelope-id>
```

This only works for Tier 0/Tier 1 envelopes and only when the proposed agent maps to an existing safe read-only task manifest. It refuses strong/protected envelopes and agents without a safe mapping.

## Reply Delivery

After an approved light run succeeds, use:

```bash
hub telegram reply <envelope-id> --from-output latest --dry-run
hub telegram reply <envelope-id> --from-output latest
```

Reply delivery sends the latest passing output for the envelope's executed task back to the original Telegram chat. It is not automatic.
