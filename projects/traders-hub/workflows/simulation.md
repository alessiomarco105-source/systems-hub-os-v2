---
owner: trader-simulator
reviewer: traders-hub-engineer
status: active
data_class: internal
project: traders-hub
updated: 2026-06-15
review_after: 2026-07-01
sources:
  - legacy:wiki/systems-hub/operations/harness/projects/traders-hub/simulation-harness.md
  - legacy:wiki/traders-hub/simulation/coverage.md
  - legacy:wiki/traders-hub/simulation/scenario-catalog.md
---

# Simulation Workflow

## Layers

1. Deterministic contract checks
2. Local browser journeys
3. Approved preview journeys with synthetic users and data
4. Production read-only smoke only after explicit approval

## Core Packs

- activation and onboarding;
- full trade and no-trade days;
- repeated sessions and resume;
- trade input and CSV;
- reviews and analytics reconciliation;
- language, device, timezone, and period boundaries;
- beta and subscription access states.

## Current Baseline

- June 7 controlled pilot: 27 completed simulations
- June 7 deterministic batch: 250 completed contract scenarios
- Confirmed critical/high product findings: none after oracle calibration

## Main Coverage Gaps

- authenticated onboarding through first completed review;
- two real browser sessions on one date;
- real CSV and duplicate import;
- Italian/English switching after authentication;
- testing-to-paid access with persisted Supabase data.

Never write simulated data to production.
