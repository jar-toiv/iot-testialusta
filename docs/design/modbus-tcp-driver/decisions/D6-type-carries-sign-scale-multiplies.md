# D6: `type` carries the sign, `scale` multiplies

- **Date:** 2026-10-14
- **Status:** Accepted, schema not yet changed
- **Serves:** REQ-MTD-004

## Decision

- The profile register drops `signed`. `type` alone states the encoding,
  with the values of the EM111 CP's Data Format column: `int16`, `uint16`,
  `int32`, `uint32`.
- `scale` stays a multiplier: value = raw x `scale`. CP "Value weight:
  Volt*10" becomes `scale: 0.1`.

## Why

- `signed` and `type` could contradict each other (`signed: false` with
  `int32`). One field cannot.
- The type is copied from the datasheet as written. CP §2.1 (p. 7) defines
  INT32 as signed, 2's complement, and UINT32 as unsigned.
- A multiplier matches the 2026-09-20 notes' sources (evcc,
  `solar-inverter-modbus-registers`, secondary).
