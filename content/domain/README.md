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

Works represent intellectual objects. Sources represent the particular edition,
article, dataset, legal text, archival record, or web manifestation actually
consulted. Statement-to-Source citation relationships own evidentiary roles and
locators. Publisher, library, authorized-reading, archive, and purchase links
are secondary resource metadata; purchase links must disclose affiliate status
and never serve as canonical identifiers.
