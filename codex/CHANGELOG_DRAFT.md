# Changelog Draft

## Theme: Toolbox workflow completion
- Added Toolbox routes for scheduling and detail views:
  - `/toolbox/new` (`ToolboxCreatePage`)
  - `/toolbox/:id` (`ToolboxTalkDetailPage`)
- Implemented toolbox create flow (topic/date/conductor/location/notes) and detail operations (load talk, load attendees, add attendee, complete talk).

## Theme: Discoverability parity expansion
- Added JSA to primary sidebar navigation.
- Added `/jsa` route and `JsaPage` with minimal operational flow (list templates, list instances, create instance).

## Theme: Regression protection
- Added toolbox route-level test coverage for list/new/detail flows.
- Updated layout navigation test to assert both Toolbox Talks and JSA links.

## Theme: Session auditability
- Updated codex session artifacts with execution log, decisions, verification evidence, and checkpoints.
