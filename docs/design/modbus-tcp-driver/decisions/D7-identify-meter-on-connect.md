# D7: Identify the meter on every new connection

- **Date:** 2026-10-14
- **Status:** Accepted, schema not yet changed
- **Serves:** REQ-MTD-011, REQ-MTD-012, REQ-MTD-013

## Decision

- On every new TCP connection, before the first cycle, MTD reads `000Bh`
  (identification code), `0302h` (firmware version) and `0303h` (firmware
  revision), each as one UINT16 word (D5).
- The expected code lives in the profile as `identificationCode`. EM111-DIN
  AV8 1 x S1 X is 103 (CP Table 2.6-2).
- On a mismatch every register of that meter is emitted as `BAD`,
  `value: null`, without substatus (as D1, D3). The process keeps running,
  and the check runs again on the next connection.
- A failed identification read (timeout, exception or malformed) gives the
  same `BAD` readings, and the connection is closed so the next one repeats
  the check (2026-10-15).
- Firmware version and revision travel with the readings as metadata. They
  are not polled.

## Why

- A wrong slave address that reaches another device still answers, and its
  values would pass as `GOOD`. CP §1.3.1 item 5 names "reached with a wrong
  address" as a fault case.
- The code depends on the variant (AV8 103, AV7 101), so it belongs to the
  profile, one per model.
- Stopping the process instead would only work at startup and would clash
  with REQ-MTD-010, which keeps MTD running while the gateway is away.
- The three registers never change in operation, so polling them would store
  a constant every second.
