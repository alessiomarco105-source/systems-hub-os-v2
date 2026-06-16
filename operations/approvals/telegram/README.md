# Telegram Approval Envelopes

Inbound messages from `@Systemshub_bot` can be captured here as local task envelopes.

Envelope capture is not execution. Each envelope starts as `pending_marco_approval` and cannot:

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

Running the routed agent requires a separate Marco approval.
