# Notes for each feature I did


- This document is practice of SSD and should eventually be found from `/docs`


| Form | Pattern | Use when |
|---|---|---|
| Ubiquitous | `THE SYSTEM SHALL <response>` | Always true, no trigger |
| Event-driven | `WHEN <trigger> THE SYSTEM SHALL <response>` | A specific event happens |
| State-driven | `WHILE <state> THE SYSTEM SHALL <response>` | Behavior depends on an ongoing state |
| Unwanted behavior | `IF <condition> THEN THE SYSTEM SHALL <response>` | Error / fault handling |
| Optional feature | `WHERE <feature is present> THE SYSTEM SHALL <response>` | Conditional on configuration/hardware |
| Complex | `WHILE <state>, WHEN <trigger> THE SYSTEM SHALL <response>` | An event that matters only in a given state |

Every requirement traces to a measurement or an ADR.

## 11-9-26 feat modbus-tcp-driver
- initialized Kiro design with EARS notation. Starting to practice it.1

- PRs: #24-#41 (12-9-26 ... 2-10-26), all from branch `feature/modbus-tcp-driver`
- Status: config loading done (#39-#41), loader tested for a missing gateway or profile folder (6-10-26), driver not wired to it yet, `tasks.md` still an empty template
- Implemented: not yet

### Requirements (practice)

| Form | Pattern | Requirement | Source |
|---|---|---|---|
| Ubiquitous | `THE SYSTEM SHALL <response>` | | |
| Event-driven | `WHEN <trigger> THE SYSTEM SHALL <response>` | WHEN program is initiated, Modbus TCP Driver SHALL get the gateway and profile configs from the configured folders and validate each against its own schema before polling starts. | open |
| State-driven | `WHILE <state> THE SYSTEM SHALL <response>` | | |
| Unwanted behavior | `IF <condition> THEN THE SYSTEM SHALL <response>` | IF the gateway or profile folder is missing or contains no config files, THEN Modbus TCP Driver SHALL stop startup before polling and report which folder was checked. | open |
| Unwanted behavior | `IF <condition> THEN THE SYSTEM SHALL <response>` | IF a config file does not match its own schema, THEN Modbus TCP Driver SHALL stop startup before polling and report the file path and the fields that failed. | open |
| Optional feature | `WHERE <feature is present> THE SYSTEM SHALL <response>` | | |
| Complex | `WHILE <state>, WHEN <trigger> THE SYSTEM SHALL <response>` | | |