# Runtime Schemas

Machine-readable contracts for agents, projects, tasks, context packs, approvals, gates, and receipts.

Current contracts:

- `task-manifest.schema.json`: role, scope, context allowlist, permissions, budgets, output contract, and validation rules;
- `run-receipt.schema.json`: context supplied, provider usage, cost, output hash, validation result, and promotion state.

The pilot runner validates the executed manifest deterministically before contacting a provider. JSON Schema files document the portable contract; runtime enforcement remains explicit code so it does not depend on an unreviewed validation package.
