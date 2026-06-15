# Run Receipt — Task Manifest, Output Validator, and Usage Receipts

Date: 2026-06-15
Agent: COS-Business / Harness Orchestrator
Approval: `approved: build task manifest schema, output validator, and usage receipts`

## Result

Built and verified the first declarative task execution contract for Pi and DeepSeek.

## Components

- JSON Schema for task manifests;
- JSON Schema for run receipts;
- deterministic manifest and context validator;
- restricted manifest runner using the existing sandbox launcher;
- provider usage and cost extraction from Pi JSON events;
- Markdown output validation;
- section-specific required-pattern validation;
- immutable output hash and usage receipt;
- first COS-Business executive-brief manifest.

## Pre-Run Controls

The runner rejects:

- manifests outside `operations/tasks/`;
- unexpected manifest fields;
- unsupported providers or models;
- write or external-action permission;
- non-read-only tools;
- private or protected data in the current pilot;
- missing or disallowed `data_class` metadata;
- secret-like filenames, path traversal, and symlinks;
- excessive file count or context bytes;
- invalid regular expressions.

## Post-Run Controls

The runner validates:

- output word count;
- required sections and first heading;
- no unapproved preamble;
- global and section-specific required patterns;
- forbidden claims;
- evidence or uncertainty language;
- provider stop reason;
- input, output, total-token, and cost budgets.

Every output and receipt is saved even when validation fails. Failed outputs are ineligible for promotion and remain useful audit evidence.

## Calibration Results

The first attempts correctly surfaced:

- excessive visible length;
- a pattern that incorrectly matched a negated statement;
- an approved-priority substitution;
- an incorrect project-lane classification;
- preamble noncompliance;
- a difference between visible word count and provider-billed reasoning tokens.

The final run passed all deterministic checks:

- model: `deepseek-v4-flash`;
- context files: 5;
- context bytes: 6,483;
- input tokens: 129;
- output tokens: 1,676;
- cache-read tokens: 4,352;
- total tokens: 6,157;
- cost: `$0.0004995256`;
- visible word count: 320;
- output validation: pass;
- human review required: true;
- output hash verification: pass.

## Security Regression

The synthetic security fixture passed again after launcher changes:

- approved context readable;
- secrets and source-directory enumeration blocked;
- write capability unavailable;
- unsafe paths, symlinks, and models rejected;
- temporary staging removed.

## Boundaries

- Token and cost budgets are verified after the provider response; Pi does not currently expose a hard per-task output-token cap through this launcher.
- File count and context-byte limits are enforced before the request.
- Pattern validation catches known errors, not every possible semantic mistake.
- A pass makes an output reviewable, not canonical or externally actionable.
- `context-mode` was assessed but not installed; third-party source review and separate approval remain required.
