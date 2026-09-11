# [Feature name]: Requirements

- **Status:** Draft | Accepted | Implemented
- **Related:** ADR-XXXX, ADR-YYYY

## User story

Who needs this and why. One or two sentences: what does this feature let
someone do that they couldn't do before?

## Requirements (EARS notation)

Write every requirement in one of these forms. Pick the form that matches
the trigger. Don't force everything into "WHEN".

| Form | Pattern | Use when |
|---|---|---|
| Ubiquitous | `THE SYSTEM SHALL <response>` | Always true, no trigger |
| Event-driven | `WHEN <trigger> THE SYSTEM SHALL <response>` | A specific event happens |
| State-driven | `WHILE <state> THE SYSTEM SHALL <response>` | Behavior depends on an ongoing state |
| Unwanted behavior | `IF <condition> THEN THE SYSTEM SHALL <response>` | Error / fault handling |
| Optional feature | `WHERE <feature is present> THE SYSTEM SHALL <response>` | Conditional on configuration/hardware |
| Complex | `WHILE <state>, WHEN <trigger> THE SYSTEM SHALL <response>` | An event that matters only in a given state |

Every requirement traces to a measurement or an ADR.

- REQ-1 (Form): ...

## Acceptance criteria

Turn each requirement above into something testable: a condition that is
either true or false once the feature exists. Every REQ gets one.

- [ ] REQ-1 is verified by: ...
