---
owner: harness-orchestrator
status: active-standard
data_class: internal
updated: 2026-06-16
---

# Agent Loop v2

## Purpose

Make Systems Hub agents less passive and more compounding: every serious task should move through a visible loop that gathers enough context, executes, reviews, records evidence, and captures reusable learning.

The goal is not to spend tokens blindly. The goal is to spend the right tokens on evidence, checks, and reusable improvement instead of shallow agreement.

## Default Loop

1. **Intake**
   - Identify owner agent, scope, target output, deadline, risk tier, and approval boundary.
   - Define done criteria before work begins.
   - State known blockers or missing inputs.

2. **Context Plan**
   - Load the role, relevant project/company files, current source of truth, and capability notes.
   - Use small context first.
   - Expand only when a named question cannot be answered.

3. **Expertise Pass**
   - Check existing capability knowledge before improvising.
   - If the task requires domain expertise the agent lacks, research primary or approved sources and record useful findings as a proposed capability update.
   - Do not treat unreviewed external content as authority.

4. **Execution Pass**
   - Produce the draft, local change, analysis, or governed artifact.
   - Use deterministic tools for counting, validation, file inspection, formatting, tests, and extraction.
   - Keep protected actions blocked until Marco approval.

5. **Self-Review**
   - Compare output against done criteria, source evidence, risk boundary, and style/preferences.
   - Identify unsupported claims, omitted risks, and next checks.
   - Fix issues before asking for promotion.

6. **Independent Review**
   - Required for decision-grade outputs, high-risk work, security/payment/auth/legal/privacy changes, finance structure, scheduler/governance changes, and meaningful product code.
   - Optional for low-risk summaries and local drafts.

7. **Promotion Gate**
   - Ask for explicit approval before committing, pushing, sending, publishing, paying, deploying, changing production settings, or finalizing finance records.
   - Approval must name the exact action.

8. **Receipt**
   - Record result, changed files/artifacts, checks, evidence, cost/usage when available, blockers, and next action.
   - Failed runs are useful evidence if they explain what changed.

9. **Learning Capture**
   - If the task taught a reusable method, pattern, failure mode, prompt calibration, test command, or domain rule, propose a capability/skill update.
   - Use `capabilities/skill-update-template.md`.
   - Do not silently rewrite agent identity, governance, scheduler authority, or security policy.

## Persistence Rule

An agent should keep working until one of these happens:

- done criteria are met;
- a required approval boundary is reached;
- a missing input genuinely blocks progress;
- the work reveals a higher-risk owner should take over;
- repeated tool/runtime failure makes further progress wasteful.

"A decent answer" is not a stop condition for meaningful work.

## Compounding Engineering Rules

- Prefer one strong loop over many shallow replies.
- Use cheap model calls for extraction, routing, and routine status.
- Use stronger model calls for synthesis, ambiguity, and risk-heavy review.
- Do not save tokens by skipping evidence or concealing uncertainty.
- Reuse validated outputs as context instead of re-reading everything.
- Convert repeated work into scripts, manifests, checklists, or skills.
- Calibrate validators after failures so the next run succeeds for structural reasons.

## Risk Tiers

| Tier | Examples | Required Loop |
|---|---|---|
| Low | recap, draft, local note, simple classification | Intake, context, execution, self-review, receipt |
| Medium | business decision, finance capture, content strategy, product spec | Full default loop; independent review when decision-grade |
| High | code, payments, auth/RLS, security, legal/privacy, scheduler, user data | Full default loop plus independent/adversarial review and explicit approval |
| Protected | publish, send, pay, deploy, commit, production change, core governance | Full default loop plus per-action Marco approval |

## Output Contract

For non-trivial work, agents should make these visible:

- Owner:
- Scope:
- Done criteria:
- Evidence used:
- What changed:
- Checks:
- Approval needed:
- Next action:

## Relationship To Existing Governance

This loop extends `governance/work-lifecycle.md`. It does not override:

- model access policy;
- token efficiency policy;
- approval policy;
- security policy;
- agent role boundaries;
- Marco's preferences.
