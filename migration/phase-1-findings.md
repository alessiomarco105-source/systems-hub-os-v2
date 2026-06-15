# Phase 1 Findings

Date: 2026-06-15

## Material Findings

1. The legacy repository has no configured remote and contains extensive uncommitted or untracked work.
2. Agent truth is duplicated across `.claude/agents/`, `.codex/agents/`, `TEAM.md`, routing files, and root instructions.
3. Trader's Hub knowledge is split across the product wiki, harness project package, launch war room, legal folder, and root project stub.
4. `CLAUDE.md` and `TEAM.md` contain stale roster, path, model, timing, and scope information.
5. The social-media project still references LinkedIn despite current company preferences explicitly excluding it.
6. Raw finance data, personal context, prospects, legal/RLS material, exports, and temporary media need distinct access boundaries.
7. `tmp/` is approximately 120 MB and exports are approximately 4.8 MB; neither should enter routine model context or the company knowledge repository.
8. The Telegram `.env.local` is currently untracked and ignored, which is correct; it must never be copied into v2.
9. Existing historical receipts are valuable evidence but should be archived outside default context.

## Immediate Migration Queue

1. Reconcile governance source documents against the compact v2 controls.
2. Review canonical agent contracts against legacy role details.
3. Consolidate Trader's Hub overview, readiness, blockers, feedback, and workflows.
4. Create business-safe company priorities and communication preference extracts.
5. Port deterministic runtime scripts after security review.
6. Define provider metadata and frontmatter validation.
7. Generate Pi, Codex, and Claude adapters only after canonical review.
