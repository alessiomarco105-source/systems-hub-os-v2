---
owner: marco
status: canonical
data_class: internal
core_protected: true
updated: 2026-06-15
---

# Approval Policy

Marco approval is required before:

- posting, publishing, sending email, DMs, or outreach;
- paying, invoicing, refunding, subscribing, or changing billing;
- changing legal, privacy, customer-data, payment, auth, RLS, DNS, or production configuration;
- committing, pushing, merging, deploying, or deleting business-critical material;
- changing governance, agent authority, routing, scheduler authority, provider access, or security controls.

Approval is exact and non-transferable:

```text
approved: [specific action]
```

Approval for a draft is not approval to publish. Approval to commit is not approval to deploy. Approval for project work is not approval to change the harness.
