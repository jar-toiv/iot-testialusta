# Modbus TCP driver: Requirements

- **Status:** Draft
- **Related:** ADR-0004, ADR-0020

## Introduction

MTD (Modbus TCP Driver) reads Carlo Gavazzi EM111 energymeter registers via an RS485/TCP gateway and emits decoded, quality tagged readings for the next layer in the pipeline.

The gateway's own polling mode (ADR-0020, option D) would have given values without a driver, but it turns a broken connection into a zero instead of a fault. For that reason it is not used, and both reading and quality tagging are left to the driver.

MTD does not cover:

- Normalisation as a layer. MTD applies the register weight and emits SI
  (REQ-MTD-004). Anything past that belongs to the normaliser.
- The quality gate as a layer, `STALE` included. MTD sets a reading's initial
  quality, because only the driver knows whether an answer arrived.
- Buffering and publishing. MTD knows nothing about the broker.
- Splitting the registers into a fast and a slow group. Configuration allows
  it, this feature reads one group.
- Frontend, visualisation, power peaks, energy watch.

## Requirements

| REQ | Form | Requirement | Source |
|---|---|---|---|
| REQ-MTD-001 | Ubiquitous | MTD SHALL poll the configured register group in cycles, at the configured polling interval. | ADR-0020: Simple mode, MTD owns the polling clock. Option D, the gateway polling on its own, was rejected |
| REQ-MTD-002 | Event-driven | WHEN a Modbus response is received, MTD SHALL emit one reading per configured register with quality **GOOD**. | ADR-0004 |
| REQ-MTD-003 | Unwanted behaviour | IF no response is received within the configured response timeout, MTD SHALL emit one reading per configured register with **value null**, quality **BAD** and substatus **TIMEOUT**. | ADR-0004 |
| REQ-MTD-004 | Ubiquitous | MTD SHALL decode each register according to the register map: word order LSW to MSW, sign per the declared type, and division by the register weight, and emit the value in the unit declared for that register. | `EM111_EM112_ET112_CP.pdf` via `hardware/carlo-gavazzi-em111/configuration.md` |
| REQ-MTD-005 | State-driven | WHILE some registers in the group answer and others do not, MTD SHALL decide quality per register from that register's own outcome, and SHALL NOT suppress the **GOOD** readings or mark the whole group **BAD**. | ADR-0004: `quality` is a field of one `Reading`, and a `Reading` carries one `source.point` |
| REQ-MTD-006 | Unwanted behaviour | IF the meter or the gateway answers with a Modbus exception response, THEN MTD SHALL emit that register's reading with **value null** and quality **BAD**. | Modbus Application Protocol v1.1b, function code + 0x80 |
| REQ-MTD-007 | Unwanted behaviour | IF a response is malformed or its byte count does not match the requested word count, THEN MTD SHALL emit that register's reading with **value null** and quality **BAD**, and SHALL NOT decode the frame partially. | Modbus Application Protocol v1.1b |
| REQ-MTD-008 | Unwanted behaviour | IF the TCP connection to the gateway cannot be opened or is lost, THEN MTD SHALL emit **value null** and quality **BAD** for every register in that cycle. | ADR-0020 |
| REQ-MTD-009 | Ubiquitous | MTD SHALL emit exactly one reading per configured register in every cycle, whatever the outcome of the individual reads. | ADR-0004: `quality` is a field of one `Reading`. OPC UA Part 4 §5.10.2 Read: one result per requested node, and a failed read carries a status code instead of being omitted |
| REQ-MTD-010 | State-driven | WHILE the TCP connection to the gateway is unavailable, MTD SHALL keep the cycle clock running and attempt the connection again on the next cycle, so that a returning gateway is picked up without a restart. | ADR-0020 |
| NFR-MTD-001 | State-driven | WHILE every register in the group answers, MTD SHALL hold the interval between consecutive cycle starts within `TBD, source required` of the configured polling interval. | `TBD, source required`: timer jitter of the driver process measured on the Pi. No such measurement exists. The 0.130 s round trip in ADR-0020 phase 5 was measured with `mbpoll`, not with the driver. |
| NFR-MTD-002 | Event-driven | WHEN the meter stops answering, MTD SHALL emit the first **BAD**/**TIMEOUT** reading for the register being polled within 1 s. | EM111 CP: 500 ms response timeout, 40 ms typical answer |

## Verification

- [ ] REQ-MTD-001, bench. Run MTD against the meter for 10 minutes and log
  every cycle. Pass when the number of cycles matches the run time divided by
  the polling interval and no cycle is skipped. The interval itself is
  NFR-MTD-001.
- [ ] REQ-MTD-002, unit test. Feed a recorded Modbus response for the
  configured group into the decoder. Pass when the number of readings equals
  the number of registers in the group, every quality is `GOOD`, and the
  values match the ones read by hand from the meter display.
- [ ] REQ-MTD-003, bench. Break the RS485 bus by disconnecting `TB` while
  MTD is polling. Pass when every register in the group produces `value:
  null`, quality `BAD` and substatus `TIMEOUT`, and no zero values appear.
  The detection time is NFR-MTD-002.
- [ ] REQ-MTD-004, unit test. Record one raw response per register with MTD
  itself and store it as a fixture under `tests/fixtures/em111/`. Each
  fixture carries the value shown on the meter display at the moment of
  recording, entered by hand. Pass when the decoder reproduces every one of
  those values. A fixture whose value was never compared against the display
  is not a valid case, because a fixture recorded and decoded by the same
  code proves only that the code agrees with itself. At least one fixture
  must be a negative INT32 reading: word order and sign are provable only on
  a value that becomes obviously wrong when the two words are swapped.
- [ ] REQ-MTD-005, unit test. Fake transport that answers for some registers
  of the group and times out for the rest. Pass when the answering registers
  are `GOOD` with their decoded values and only the silent ones are `BAD`.
- [ ] REQ-MTD-006, unit test. Fake transport that returns function code
  + 0x80 with an exception code. Pass when that register's reading is
  `value: null`, `BAD`, and no value is emitted.
- [ ] REQ-MTD-007, unit test. Fake transport that returns a frame whose byte
  count is one word short. Pass when the reading is `value: null`, `BAD`, and
  no partially decoded number appears in the output.
- [ ] REQ-MTD-008, bench. Disconnect the Ethernet cable between the Pi and
  the gateway while MTD is polling. Pass when every register in the cycle
  produces `value: null` and `BAD`.
- [ ] REQ-MTD-009, unit test. Fake transport that, within one cycle, answers
  one register, times out on a second, returns an exception response for a
  third and a truncated frame for a fourth. Pass when the cycle emits exactly
  as many readings as the group has registers, no more and no fewer. This is
  the test of the invariant: it fails both on a silently dropped register and
  on a duplicated one.
- [ ] REQ-MTD-010, bench. Same run as REQ-MTD-008. Reconnect the Ethernet
  cable. Pass when the group returns to `GOOD` without restarting MTD, and
  when the cycles during the outage are present in the log rather than
  missing.

- [ ] NFR-MTD-001, bench. Run MTD on the Pi against the meter for 10 minutes,
  log each cycle start from a monotonic clock, and report the distribution of
  the interval, not only its mean. This run produces the number the
  requirement is missing. Until it has been run, NFR-MTD-001 cannot pass or
  fail. Pass, once the number exists, when every interval stays within it.

- [ ] NFR-MTD-002, bench. Same run as REQ-MTD-003. Disconnect `TB` and
  timestamp both the disconnect and the first `BAD`/`TIMEOUT` reading. Pass
  when the difference is at most 1 s.

## Open questions

- ADR-0004 is still a draft, so the envelope REQ-MTD-003 relies on
  (`value: null`, `BAD`, `TIMEOUT`) may still change.
- NFR-MTD-002's 1 s assumes one timeout per register with no retry. The EM111
  CP advises a retry after 500 ms, which would raise the figure. design.md
  carries that choice as D2.
- REQ-MTD-006, REQ-MTD-007 and REQ-MTD-008 name no substatus. ADR-0004 has
  only `TIMEOUT` and `STALE`, and its rule is that a new substatus arrives
  with the ADR of the protocol that produces it. These three stay `BAD`
  without a substatus until a Modbus TCP ADR says otherwise. design.md
  carries the same choice as D1 and D3.
- A gateway that cannot be reached over TCP is not the same fault as a meter
  that does not answer, and REQ-MTD-008 currently loses that distinction in
  the data. It is visible in the log only. Whether the dashboard needs to
  tell them apart is what settles the substatus question above.