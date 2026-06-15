---
owner: security-officer
approver: marco
status: active
data_class: protected
project: traders-hub
updated: 2026-06-15
review_after: 2026-06-18
sources:
  - legacy:wiki/risks/security-and-compliance.md
  - legacy:wiki/systems-hub/operations/harness/runs/2026-06-15-security-exposure-and-integrity-review.md
---

# Trader's Hub Security Risk Register

| Severity | Risk | Status | Required evidence |
|---|---|---|---|
| High | High-severity Vite/esbuild/plugin dependency advisories | Open | Patched dependency tree plus full regression checks |
| High | RLS not verified with isolated User A/User B tests | Open | Logged cross-user read/write test |
| High | Beta access states not verified with approved and pending accounts | Open | Authenticated account test evidence |
| Medium | Backup restore not tested | Open | Completed recovery drill |
| Medium | Privacy/terms production and authenticated-app visibility not fully verified | Open | Production URL and in-app checks |
| Medium | GDPR export and deletion incomplete | Open | Approved design and verified implementation |
| Medium | Base64 screenshots may contain financial or personal data | Open | Data handling decision and storage plan |
| Medium | Incident-response procedure not tested | Open | Runbook and tabletop exercise |

## Security Baseline

- No live committed secrets were confirmed in the June 15 scoped review.
- Product, auth, RLS, payments, legal, privacy, production, dependencies, and environment configuration remain protected.
