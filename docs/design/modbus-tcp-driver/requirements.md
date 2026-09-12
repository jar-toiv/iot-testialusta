# Modbus TCP driver: Requirements

- **Status:** Draft
- **Related:** ADR-0004, ADR-0020

## Introduction

MTD (Modbus TCP Driver) reads Carlo Gavazzi EM111 energymeter registers via an RS485/TCP gateway and emits decoded, quality tagged readings for the next layer in the pipeline.

The gateway's own polling mode (ADR-0020, option D) would have given values without a driver, but it turns a broken connection into a zero instead of a fault. For that reason it is not used, and both reading and quality tagging are left to the driver.

## Requirements

| REQ | Form | Requirement | Source |
|---|---|---|---|
| REQ-MTD-001 | Ubiquitous | MTD SHALL read the configured register group from the meter at the configured polling interval. | Bench phase 5, ADR-0020 |
| REQ-MTD-002 | Event-driven | WHEN a Modbus response is received, MTD SHALL emit one reading per configured register with quality **GOOD**. | ADR-0004 |
| REQ-MTD-003 | Unwanted behaviour | IF no response is received within the configured response timeout, MTD SHALL emit one reading per configured register with **value null**, quality **BAD** and substatus **TIMEOUT**. | ADR-0004 |

## Verification

- [ ] REQ-MTD-001, bench. Run MTD against the meter for 10 minutes and log
  the interval between reads. Pass when every interval stays within the
  tolerance set in design.md, and no read is skipped.
- [ ] REQ-MTD-002, unit test. Feed a recorded Modbus response for the
  configured group into the decoder. Pass when the number of readings equals
  the number of registers in the group, every quality is `GOOD`, and the
  values match the ones read by hand from the meter display.
- [ ] REQ-MTD-003, bench. Break the RS485 bus by disconnecting `TB` while
  MTD is polling. Pass when every register in the group produces `value:
  null`, quality `BAD` and substatus `TIMEOUT`, no zero values appear, and
  the first such reading arrives within the detection time set in design.md.

## Open questions

- ADR-0004 is still a draft, so the envelope REQ-MTD-003 relies on
  (`value: null`, `BAD`, `TIMEOUT`) may still change.
- A gateway that cannot be reached over TCP is not the same fault as a meter
  that does not answer, but ADR-0004 has only `TIMEOUT` and `STALE`. Either
  both fit `TIMEOUT` or a new substatus is needed.