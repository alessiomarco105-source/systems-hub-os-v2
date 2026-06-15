---
owner: security-officer
approver: marco
status: active
data_class: internal
updated: 2026-06-15
review_after: 2026-06-18
sources:
  - legacy:wiki/risks/security-and-compliance.md
  - legacy:wiki/systems-hub/operations/harness/runs/2026-06-15-security-exposure-and-integrity-review.md
---

# Company Risk Register

| Severity | Risk | Scope | Status | Owner |
|---|---|---|---|---|
| High | Trader's Hub Vite toolchain dependency advisories | Trader's Hub | Open | Engineer / Security Officer |
| High | RLS behavior not verified with isolated user accounts | Trader's Hub | Open | Engineer / Marco |
| High | Revenue, signups, testers, and content KPIs lack maintained sources of truth | Company | Open | COS-Business / CMO |
| Medium | Finance records are not decision-grade | Company | Open | COS-Business / Marco |
| Medium | Raw personal, finance, prospect, and generated files require enforced isolation | Company infrastructure | Partially mitigated in v2 | Security Officer |
| Medium | No tested backup restore or incident-response drill | Trader's Hub | Open | Security Officer / Engineer |
| Medium | GDPR export and deletion paths are incomplete | Trader's Hub | Open | Engineer / Marco |

## Closed or Mitigated

- No committed live secrets were found in the June 15 scoped security review.
- V2 excludes raw finance, temporary media, exports, and secret files from normal model-readable storage.
