# Design Specs

This directory contains feature-level design specifications, following a
Kiro-style spec-driven approach (requirements.md + design.md + tasks.md).

## Difference from ADRs

- **ADR** (`docs/adr/`) answers *why*. It is a permanent decision log,
  never edited after acceptance.
- **Design spec** (this directory) answers *what* and *how*. It lives
  alongside the implementation and is updated as the feature evolves.

A design spec references the relevant ADR for justification instead of
repeating it.

## Usage

1. Run `/spec-new <feature name>`. It copies `_template/` into a folder
   named after the feature, e.g. `docs/design/modbus-tcp-driver/`
2. Fill in `requirements.md` first (what must happen)
3. Then `design.md` (how it will be built)
4. Then `tasks.md` (in what order it will be built)
5. Check off `tasks.md` items as you implement them

## Rules

1. **One folder per feature.** No single project-wide requirements.md.
2. **requirements.md is written in EARS notation.** See the forms below.
3. **design.md contains pseudocode, not finished code.** If you find
   yourself writing real TypeScript here, move it to `src/`.
4. **tasks.md is kept current.** Check off rows as you go. The file is
   working state rather than an archive.
5. **Reference the ADR, don't repeat it.** `Related: ADR-0020` is enough.
6. **Trace both ways, but only once each.** Backwards, every REQ names its
   evidence in the Source column. Forwards, every REQ appears in the REQ
   column of design.md's Testing Strategy table, and every task names the
   REQ it serves. requirements.md carries no test entries of its own.
7. **requirements.md stays short.** Nothing restated from design.md or an
   ADR. What Kiro actually prescribes, where this project departs from it on
   purpose, and the requirements/design boundary are recorded in
   `docs/claude/kiro-spec-standard.md`. Read that before arguing about
   the style.

## EARS forms

Pick the form that matches the trigger. Don't force everything into "WHEN".
If a requirement needs two forms, it is two requirements.

| Form | Pattern | Use when |
|---|---|---|
| Ubiquitous | `THE SYSTEM SHALL <response>` | Always true, no trigger |
| Event-driven | `WHEN <trigger> THE SYSTEM SHALL <response>` | A specific event happens |
| State-driven | `WHILE <state> THE SYSTEM SHALL <response>` | Behavior depends on an ongoing state |
| Unwanted behaviour | `IF <condition> THEN THE SYSTEM SHALL <response>` | Error / fault handling |
| Optional feature | `WHERE <feature is present> THE SYSTEM SHALL <response>` | Conditional on configuration/hardware |
