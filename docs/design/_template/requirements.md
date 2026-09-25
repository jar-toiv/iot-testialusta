# [Feature name]: Requirements

- **Status:** Draft | Accepted | Implemented
- **Related:** ADR-XXXX, ADR-YYYY

## Introduction

What this feature covers, and explicitly what it does not.

## Requirements

EARS notation, one form per requirement. The forms are listed in
`docs/design/README.md`. IDs are permanent: `REQ-<FEATURE>-<NNN>` for
functional, `NFR-<FEATURE>-<NNN>` for non-functional. Every requirement cites
a source: a bench measurement, a datasheet page, or an ADR number.

| REQ | Form | Requirement | Source |
|---|---|---|---|
| REQ-XXX-001 | Event-driven | WHEN <trigger>, XXX SHALL <response>. | bench phase n, ADR-nnnn |
| NFR-XXX-001 | Ubiquitous | XXX SHALL <bounded, measurable statement>. | ... |

## Open questions

Mechanism questions left to design.md. Anything that appears to contradict an
accepted ADR goes here too, prefixed `Conflict:`, citing both the requirement
and the ADR.
