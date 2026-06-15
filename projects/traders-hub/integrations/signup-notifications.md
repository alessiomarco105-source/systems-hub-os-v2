---
owner: traders-hub-engineer
reviewer: security-officer
status: active-unverified
data_class: private
project: traders-hub
updated: 2026-06-15
review_after: 2026-06-18
sources:
  - legacy:wiki/systems-hub/operations/harness/projects/traders-hub/signup-notification.md
  - legacy:wiki/traders-hub/launch-blockers.md
---

# Signup Notifications

## Purpose

Notify Marco when a beta application or signup requires review.

## Current Evidence

- Telegram notifications are reported as active.
- Product records reference `/api/beta-signup-notify`.
- Branded applicant and internal email templates were deployed.
- Resend production environment configuration was previously reported incomplete.

## Data Minimum

Notifications should contain only the information Marco needs to identify and process the application. Secrets and unnecessary user data are prohibited.

## Missing Documentation

- exact production trigger;
- authoritative signup metric source;
- retry/failure handling;
- current Resend production configuration;
- pending-user approval workflow.
