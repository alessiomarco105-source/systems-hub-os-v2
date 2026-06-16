# Provider Access Approvals

Provider access approvals are tracked records that allow a specific manual task manifest to send non-public data classes to an approved model provider.

They are required for any manual task using `private` or `protected` context.

## Rules

- Approval must name the exact task id, provider, model, and allowed data classes.
- Approval must expire.
- Permissions must remain read-only with no external actions.
- Secrets must never be included in model context.
- The task manifest must reference the approval in `context.provider_approval`.
