# Agents

Canonical role definitions live in `roles/`. Provider-specific configuration is generated or adapted under `runtime/adapters/`.

An agent role defines:

- mission and ownership;
- allowed data and paths;
- permitted tools and actions;
- required context;
- output contract;
- escalation and stop conditions;
- review requirements.

Model names do not belong in canonical role definitions unless a capability requirement makes one necessary.

## Operating Loop

All active agents follow `operations/loops/agent-loop-v2.md` for meaningful work.

The loop requires intake, context planning, expertise pass, execution, self-review, promotion gates, receipts, and reusable learning capture. Low-risk work may compress the loop; high-risk or protected work may not.
