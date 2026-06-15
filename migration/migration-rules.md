# Migration Rules

1. No source file is moved or deleted during inventory.
2. Canonical content is rewritten or consolidated; duplicates are not copied blindly.
3. Secrets and `.env` files never enter v2.
4. Private finance, personal, prospect, and customer-level data move to restricted storage or approved summaries.
5. Generated media, temporary files, caches, and lock files are not company knowledge.
6. Historical receipts remain immutable evidence and are archived by year/month.
7. Platform-specific Claude/Codex/Pi files are adapters, not canonical role definitions.
8. Each migrated document receives owner, status, data class, updated date, and review date.
9. Cross-references must resolve inside v2 or point explicitly to a separate approved repository.
10. The legacy system remains the rollback until representative workflows pass in parallel.
