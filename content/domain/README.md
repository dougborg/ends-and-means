# Canonical domain authoring

This directory will contain the modular authoring records for the plural graph
defined in `docs/domain-model.md`. It intentionally contains no migrated records
yet: the current framework data remains transitional until each item is
reconciled rather than copied into a new shape.

Authoring is organized by entity type and relationship family. Entity files own
identity and intrinsic description; subject-centered relationship files own
substantive edges. The compiler in `src/lib/domain/` validates these records and
produces a read graph under `generated/`. Generated files never become authoring
inputs.

Declarative records may use JSON. All executable repository code remains
TypeScript.
