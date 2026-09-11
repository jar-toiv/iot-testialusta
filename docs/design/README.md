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
2. **requirements.md is written in EARS notation.** See
   `_template/requirements.md` for the forms.
3. **design.md contains pseudocode, not finished code.** If you find
   yourself writing real TypeScript here, move it to `src/`.
4. **tasks.md is kept current.** Check off rows as you go. The file is
   working state rather than an archive.
5. **Reference the ADR, don't repeat it.** `Related: ADR-0020` is enough.
6. **Trace both ways.** Every REQ has an acceptance criterion, and every
   task names the REQ it serves.
