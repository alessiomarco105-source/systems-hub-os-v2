# Runtime

Provider and tool implementation layer.

- `adapters/`: Pi, Codex, Claude, and future provider/runtime adapters
- `scripts/`: deterministic utilities
- `schemas/`: machine-readable contracts
- `state/`: generated runtime state, ignored
- `secrets/`: prohibited local fallback, ignored; prefer external secret store

Runtime adapters consume canonical governance, roles, capabilities, and project manifests. They must not become alternative sources of company truth.
