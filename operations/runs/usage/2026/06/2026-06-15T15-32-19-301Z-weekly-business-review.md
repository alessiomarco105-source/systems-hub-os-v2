## Scoreboard

| Metric | Current defensible value | Target | Evidence status |
|---|---|---|---|
| Booked platform revenue | $0 | First verified revenue | A possible $19 payment remains unverified |
| Verified active beta testers | 0 logged | 10 | Tester cohort was planned, activation not maintained |
| Trial / signups | Unknown | Baseline required | Source of truth undefined |
| Paid users | 0 logged | 1+ | Payment and booking evidence incomplete |
| Posted-content cadence | Unknown | At least 3 posts/week | Drafts exist; posted ledger missing |
| Educator partners | 0 logged | 10 | Prospect records restricted; pipeline proof incomplete |
| Critical launch blockers | Open | 0 | RLS, access-state, journey, and payment proof remain |

*Unknown means the metric is not maintained well enough to claim activity or absence. 0 logged is what the approved source literally reports.*

---

## Project Status

**Trader's Hub** — Active beta/launch. The product has implementation depth (commit `d77bc23`, June 7 simulation passed 250 contract scenarios with no confirmed defects after calibration). No committed live secrets were found in June 15 review. Bottleneck is verification and measurement, not feature construction. Open launch proof: active tester count, signup source of truth, fresh-account end-to-end journey, RLS cross-user isolation, real broker CSV import, authenticated support visibility, paid offer and pricing, one real payment transaction, and posted-content ledger. High-severity Vite dependency advisories require controlled remediation.

**Trading Edge Refinement** — Personal lane, active. Not linked to a defined company KPI beyond content supply.

**Social Media Management** — Capability build, planning. No reliable KPI inputs or post ledger.

**Trading Assistant** — Potential product, planning. Demand and scope unvalidated.

**Future vertical products** — Idea pipeline, paused. No selected validated opportunity.

*Allocation rule: Until Trader's Hub has verified launch integrity and first revenue, new-product work remains planning-only.*

---

## What Moved

- **Systems Hub OS v2 migration started** (decision 2026-06-15): A clean provider-neutral repository is being built rather than reorganising the legacy workspace in place, preserving rollback and avoiding import of duplicate or generated material.
- **June 15 scoped security review completed**: No committed live secrets confirmed; Vite dependency advisories identified as high-severity open risk.
- **Trader's Hub repository snapshot** taken at commit `d77bc23` (branch `codex/performance-review-setup`). Workflow verification, lint, build, and delivery-gate checks all passed.
- **Risk register updated**: RLS verification, revenue KPI sources, and Vite advisories remain open. V2 excludes raw finance, temporary media, exports, and secret files from normal model-readable storage (mitigated).

---

## What Is Stuck

- **RLS cross-user isolation unverified** — High-severity risk. No isolated user-account test has been completed. Cannot open paid access without this proof.
- **Payment readiness incomplete** — No paid offer/pricing confirmed, no payment provider integrated, no real payment transaction executed. First revenue by June 30 is 15 days away.
- **Active tester and signup evidence gap** — The Italian trader/student cohort was planned (May 16 decision) but activation counts are unmaintained.
- **Content posting ledger missing** — Drafts exist per the scoreboard, but posted-content cadence is unknown; distribution measurement cannot begin without a ledger.
- **Fresh-account end-to-end journey** not verified — cannot confirm a new user can sign up, access the app, and reach a paid state.

---

## Top Three Priorities

1. **Close Trader's Hub launch-proof gaps** — Verify RLS, beta access states, fresh-user journey, support visibility, and payment readiness.
2. **Create decision-grade business evidence** — Maintain sources of truth for revenue, signups, active testers, expenses, and posted-content performance.
3. **Turn approved content into measured distribution** — Track what is posted, where, and the 24-hour result.

*Constraint: Do not expand into new products or major Trader's Hub features while first-revenue, launch-integrity, and measurement gaps remain open.*

---

## Decisions Needed

**1. RLS isolation verification method**

Option 1: Isolated test accounts
- What it does: Create separate real-user accounts (non-engineer) to test that each user sees only their own data before any paid user is onboarded.
- Trade-off: Requires coordinating a tester or secondary account and time to document results; directly addresses the high-severity risk.

Option 2: Automated integration test only
- What it does: Extend the existing simulation approach with automated RLS assertions in the CI pipeline.
- Trade-off: Faster to write; may miss real-world behaviour differences between automated tests and actual multi-user browser sessions.

→ Recommendation: Use isolated test accounts first (the risk register flags this as high severity and an unverified blocker to paid access), then add automated assertions as a regression guard. Uncertainty: no approved source confirms whether a suitable test account already exists.

**2. Payment activation path for June 30 target**

Option 1: Ship a minimal paid offer with an existing payments wrapper
- What it does: Configure a single subscription or one-time offer using the simplest available payment integration, test one end-to-end transaction, and book the result.
- Trade-off: Fastest path to $1 booked; may not cover all desired plan tiers or currencies.

Option 2: Build full pricing and plan infrastructure first
- What it does: Design tiered pricing, multiple payment methods, and full billing logic before accepting any payment.
- Trade-off: Reduces rework risk; almost certainly misses the June 30 revenue deadline given current open items.

→ Recommendation: Option 1. The June 30 target and the open payment-blocker status argue for the fastest verifiable payment path. Uncertainty: no approved source identifies a specific payment provider or confirms integration effort.

**3. Content posting activation**

Option 1: Post from Marco's personal profiles per the May 11 decision
- What it does: Publish approved drafts to Marco's personal X/Instagram accounts and record each post in a maintained ledger with a 24-hour result.
- Trade-off: Uses existing credibility; the scoreboard shows unknown cadence, so a ledger must be created from scratch.

Option 2: Establish brand accounts first
- What it does: Create Trader's Hub brand social accounts before posting any content publicly.
- Trade-off: Delays distribution further; no source confirms brand accounts would be ready within 15 days.

→ Recommendation: Option 1. The May 11 approved decision already authorises personal-profile use, and the June 30 revenue target benefits from any distribution signal that can be measured. Uncertainty: no approved source states which specific drafts are ready to post.

---

## Evidence Quality

- **Maintained**: Risk register, portfolio status, launch scoreboard, current priorities, OKRs, decision log, repository snapshot commit evidence, security review scope results.
- **Unknown or missing maintained source**: Active beta tester count, signup/trial count, posted-content ledger and analytics, educator partner pipeline progression, real payment transaction evidence, broker CSV import test results.
- **Data-classification note**: Prospect records are restricted; pipeline proof is incomplete by design until Marco supplies verified data.
- **Gap severity**: Revenue, testers, signups, and content KPIs lack maintained sources of truth — flagged as high-severity company risk. Until these are created, the corresponding OKRs cannot be marked complete and the board cannot assert activity levels.
