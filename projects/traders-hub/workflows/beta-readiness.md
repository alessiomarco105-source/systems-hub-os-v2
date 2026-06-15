---
owner: traders-hub-engineer
reviewers:
  - security-officer
  - customer-experience
status: active
data_class: internal
project: traders-hub
updated: 2026-06-15
review_after: 2026-06-18
sources:
  - legacy:wiki/traders-hub/beta-readiness.md
  - legacy:wiki/traders-hub/launch-blockers.md
  - legacy:wiki/systems-hub/operations/harness/runs/2026-06-15-weekly-business-review.md
---

# Beta Readiness

## Free Beta Gate

- [ ] Fresh-account full journey passes
- [ ] Approved account enters the app
- [ ] Pending/non-approved account remains blocked
- [ ] RLS cross-user isolation passes
- [ ] Privacy and terms links work in production
- [ ] Support is visible after login
- [ ] User-facing data collection explanation is accurate
- [ ] At least one real broker CSV import passes
- [ ] Backup restore or recovery procedure is tested

## Paid Beta Gate

- [ ] First paid offer and price approved
- [ ] Checkout configured
- [ ] Webhook and entitlement behavior verified
- [ ] One real transaction completed and booked
- [ ] Failed/expired payment behavior preserves user data correctly
- [ ] GDPR export and deletion approach defined

## Evidence Rule

A code path, passing build, or written policy is not proof that production behavior was verified.
