# Plan

## A) Executive Summary

### Current state (repo-grounded)
- Frontend is a React + Router + Zustand app with routes centered on dashboard/incidents/OSHA/import/settings (`src/App.tsx`).
- Primary nav mirrors that scope and does not expose toolbox/JSA/other advanced domains (`src/components/ui/Layout.tsx`).
- Backend command registry includes toolbox and JSA modules, indicating backend capability exceeds current surfaced UX (`src-tauri/src/commands/mod.rs`, `src-tauri/src/lib.rs`).
- Database migrations include broad schema coverage (001–014), including inspections, near miss, training, equipment, sync/auth, and trade hazards (`src-tauri/src/db/mod.rs`).
- Frontend has a toolbox page implementation (`src/pages/ToolboxTalksPage.tsx`) but it is not routed in `App.tsx`.
- Baseline frontend verification passes (`pnpm -s test`, `pnpm -s exec tsc --noEmit`).
- Rust tests cannot run in this environment due to missing `glib-2.0` system dependency.

### Key risks
- Documentation and reachable UX can diverge from backend/schema capability.
- Hidden features reduce product trust and adoption.
- Rust verification gap leaves backend regression risk in this environment.
- Potential dead routes in existing toolbox page (`/toolbox/new`, `/toolbox/:id`) remain unresolved if route integration is partial.

### Improvement themes (prioritized)
1. **Feature discoverability parity**: expose implemented toolbox feature in main app routing/nav.
2. **Verification hardening**: protect route discoverability with tests.
3. **Audit trail completeness**: maintain explicit session logs/checkpoints/decisions for resume.

## B) Constraints & Invariants (Repo-derived)

### Explicit invariants
- Keep existing architecture (React frontend + Tauri/Rust backend + SQLite migrations).
- No migration/schema changes in this iteration.
- Maintain current test patterns (Vitest + RTL) and TypeScript strict compile behavior.

### Implicit invariants (inferred)
- App-level route setup should remain centralized in `src/App.tsx`.
- Sidebar navigation labels/paths in `Layout.tsx` are the user’s primary discoverability surface.
- Existing page components are expected to remain independently usable without broad store refactors.

### Non-goals
- No implementation of missing toolbox detail/new pages.
- No new backend commands or data model changes.
- No multi-user/auth/sync behavior changes this round.

## C) Proposed Changes by Theme (Prioritized)

### Theme 1 — Toolbox discoverability parity
- **Current approach**: toolbox backend/page exists but route/nav do not expose it.
- **Proposed change**:
  - Add `/toolbox` route in `src/App.tsx`.
  - Add `Toolbox Talks` nav item in `src/components/ui/Layout.tsx`.
- **Why**: smallest high-value improvement that aligns reachable UX with existing implementation.
- **Tradeoffs**: route exposure may reveal partially implemented drill-down links.
- **Alternatives rejected**:
  - Building full toolbox CRUD detail/new routes now (too broad for safe delta).
  - Leaving hidden capability (poor UX parity).
- **Scope boundary**: route+nav only.
- **Migration approach**: none (no persisted model change).

### Theme 2 — Discoverability regression protection
- **Current approach**: no tests assert toolbox route/nav discoverability.
- **Proposed change**: extend/introduce component-level tests to verify nav includes toolbox entry and routes can render toolbox page.
- **Why**: prevents backsliding.
- **Tradeoffs**: small increase in test maintenance.
- **Scope boundary**: frontend tests only.

### Theme 3 — Session resilience artifacts
- **Current approach**: no guaranteed runbook artifacts.
- **Proposed change**: keep codex logs/checkpoints updated per step and finalization.
- **Why**: interruption-safe execution trail.
- **Scope boundary**: markdown artifacts under `codex/`.

## D) File/Module Delta (Exact)

### ADD
- `codex/SESSION_LOG.md` — chronological actions.
- `codex/PLAN.md` — delta plan.
- `codex/DECISIONS.md` — judgment calls.
- `codex/CHECKPOINTS.md` — lifecycle checkpoints + rehydration summaries.
- `codex/VERIFICATION.md` — command evidence.
- `codex/CHANGELOG_DRAFT.md` — delivery draft.

### MODIFY
- `src/App.tsx` — add route entry for toolbox page.
- `src/components/ui/Layout.tsx` — add sidebar entry for toolbox page.
- `src/components/*/*.test.tsx` or new test file (if needed) — toolbox discoverability regression protection.
- `codex/*` files — iterative updates.

### REMOVE/DEPRECATE
- None in this iteration.

### Boundary rules
- Allowed: route/nav wiring and tests.
- Forbidden: schema migrations, auth/security changes, large refactors.

## E) Data Models & API Contracts (Delta)

### Current
- Types/interfaces in `src/lib/types.ts` and Rust structs in command/db modules.

### Proposed changes
- No data model or API contract changes.

### Compatibility
- Fully backward compatible; only UI discoverability changes.

### Migrations
- None.

### Versioning strategy
- N/A for this delta.

## F) Implementation Sequence (Dependency-Explicit)

1. **Step S1: Route integration**
   - Objective: expose toolbox page via app routes.
   - Files: `src/App.tsx`.
   - Preconditions: baseline green (frontend).
   - Dependencies: existing `ToolboxTalksPage` export.
   - Verification: `pnpm -s exec tsc --noEmit`.
   - Rollback: revert route import/entry.

2. **Step S2: Navigation integration**
   - Objective: expose toolbox in sidebar.
   - Files: `src/components/ui/Layout.tsx`.
   - Preconditions: S1 done.
   - Dependencies: route path exists.
   - Verification: `pnpm -s exec tsc --noEmit`.
   - Rollback: remove nav item.

3. **Step S3: Regression test coverage**
   - Objective: protect discoverability from regression.
   - Files: new/updated frontend test file(s).
   - Preconditions: S1/S2 done.
   - Dependencies: route/nav present.
   - Verification: `pnpm -s test`.
   - Rollback: revert test-only changes if unstable; adjust to deterministic mocks.

4. **Step S4: Full verification + artifact finalization**
   - Objective: run final suite and update codex logs/checkpoints/changelog.
   - Files: `codex/*`.
   - Verification: `pnpm -s test`, `pnpm -s exec tsc --noEmit`, `cd src-tauri && cargo test` (documented warning expected).

## G) Error Handling & Edge Cases
- Current pattern: async `invoke` calls with try/catch in page components and store-level async actions.
- Proposed improvements in this delta: none to error taxonomy.
- Edge cases considered:
  - Toolbox page with no active establishment should avoid load calls (already handled by early return logic).
  - Empty datasets should render empty states (already implemented in page).
- Tests:
  - Ensure nav item text/path remains present.

## H) Integration & Testing Strategy
- Integration points:
  - `Layout` nav item ↔ `App` route registration.
- Unit/regression tests:
  - Add nav assertion test around `Layout` or app route rendering.
- Definition of Done:
  - Toolbox reachable from sidebar.
  - Frontend tests/typecheck pass.
  - Session artifacts and checkpoints updated.

## I) Assumptions & Judgment Calls
- Assumption: exposing `/toolbox` is valuable even if deeper toolbox routes are not yet integrated.
- Assumption: current environment limitation for Rust tests is acceptable if documented.
- Judgment call: prioritize small UX parity change over broad feature completion to keep risk low and reversible.
- Alternative deferred: full toolbox sub-routes and action flows.
