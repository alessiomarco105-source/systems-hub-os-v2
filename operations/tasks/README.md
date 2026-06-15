# Task Manifests

Each model run starts from a reviewed JSON manifest.

Manifests declare:

- role and scope;
- provider and model;
- exact context files and data classes;
- tool and action permissions;
- pre-run context limits;
- post-run token and cost budgets;
- required output structure;
- deterministic validation rules.

JSON is used because it is natively parseable and validates cleanly against JSON Schema. Agents may present a YAML view to humans, but the executed artifact must be JSON.

Run a reviewed task:

```bash
node runtime/scripts/run-task-manifest.mjs \
  operations/tasks/cos-business-executive-brief.json
```

The runner writes:

- the model output under `operations/runs/usage/YYYY/MM/`;
- a JSON receipt beside it with token usage, cost, context files, hash, validation failures, and promotion status.

A validator pass never removes the human-review requirement.
