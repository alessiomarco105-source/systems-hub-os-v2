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
