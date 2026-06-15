---
owner: traders-hub-engineer
status: canonical-summary
data_class: internal
project: traders-hub
updated: 2026-06-15
review_after: 2026-07-01
sources:
  - repo:AGENTS.md
  - repo:docs/ARCHITECTURE.md
  - repo:docs/DATA.md
  - repo:docs/CONVENTIONS.md
---

# Architecture Summary

## Stack

- React 19 and Vite 7
- Supabase authentication and user-data persistence
- Recharts
- Vercel hosting and serverless functions
- Lemon Squeezy checkout/webhook implementation in repository

## Structural Rules

- Plain JavaScript
- Inline styles; theme values come from `useTheme()`
- String-based page routing in `AppShell`
- Central application state in `src/App.jsx`
- `useLS` is the persistence interface
- Versioned persistence keys require migration before change
- Existing component interfaces remain stable unless the task requires change

## Access Model

- Supabase session gates authenticated use.
- Manual beta approval and paid subscription status determine access.
- Demo mode uses isolated in-memory sample data.

## Protected Technical Areas

- `src/supabase.js`
- `supabase/`
- `api/`
- `.env*`
- Vercel configuration
- persistence keys and data migrations
- authentication, RLS, payment, privacy, and legal behavior
- package and lockfile changes

Exact architecture and schema details remain canonical in the product repository docs.
