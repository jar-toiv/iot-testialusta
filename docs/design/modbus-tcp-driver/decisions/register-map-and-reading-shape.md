# Register map and reading shape

Working notes from the design session of 2026-09-20. Not accepted design yet.
ADR-0021 was set aside during this session because it names a file

## Decided

**Read strategy.** One block read per poll, not one Modbus request per
register. `readHoldingRegisters(dataAddress, length)` carries both the start
address and the register count, so the block is the driver's choice, not a
library constraint. Two block reads are expected, because the map holds both
16-bit and 32-bit registers.

**Map is data, read at startup.** The map stays a JSON file that the process
reads when it starts and validates against a Zod schema before the driver
touches it. Restart after a crash goes through the identical path.

**File split.** Two files, linked by a model identifier:

- device profile, one per meter model, holds what is fixed for every EM111 in
  the world
- installation config, one per physical meter, holds gateway IP, port, Modbus
  unit id and poll interval, sourced from environment variables

**Per-register fields.** `addr`, `count`, `signed`, `scale`, `min`, `max`.
Word order is a device-level field, since the EM111 manual states it once for
the meter and not per register.

**Plausibility bounds.** `min` and `max` live in the map. A reading outside
them is tagged UNCERTAIN and kept, never dropped. An overvoltage from a
lightning surge is the most valuable row in the log, so a quality gate that
discards it defeats the purpose.

**Quality tag states an observation, not a cause.** The driver cannot tell a
wrong `scale` from a real overvoltage. Both produce the same out-of-range
number. The tag records that the value fell outside the bounds, and the
measured value and the bound are both kept so a human can tell which one is
wrong.

**Driver output fields.** Quantity identifier, value, SI unit, quality,
device identifier, timestamp. No Modbus concepts cross this boundary.

**Timestamp.** ISO 8601 in UTC with milliseconds 2026-09-20T11:23:45.123Z, produced in the driver at
measurement time, not in the publish layer.
The frontend converts to local time for display.

**Two kinds of bounds, two files.** This corrects the "Plausibility bounds"
entry above, which put `min` and `max` in the device profile.

| Bound | Comes from | Lives in |
| --- | --- | --- |
| Measuring range | The meter's datasheet | Device profile |
| Plausibility range | Main fuse, inverter rating, nominal grid voltage | Installation config |

The profile's promise is that it holds for every EM111 anywhere. A fuse size
does not. The `min: 190` and `max: 255` currently in
`src/drivers/em111-register.json` are Finnish distribution voltage bounds, so
they belong on the installation side. The same meter on a 100 V grid would be
healthy and that profile would tag every reading UNCERTAIN.

For a quantity that may legitimately be negative, such as active power, the
two directions have different origins. The positive bound is what the site can
draw, set by the main fuse. The negative bound is what the site can feed back,
set by the inverter rating, and with no generation on site any negative power
is already implausible.

**`signed` is not a probability estimate.** It states how the meter encodes
the number, and it is read from the manual per register. A wrong value here
never shows up in voltage, because the top bit is zero in normal operation. It
shows up only where the value goes negative: an unsigned reading of -300 W
comes out as roughly 4 294 967 000.

## Open

- Identifier linking installation config to device profile: filename or a
  model field inside the profile.
- EM111 S1 measuring range. Datasheet not opened, so the profile cannot carry
  a device-level bound yet.
- Where the installation config lives. It does not exist as a file yet.
- `src/drivers/em111-register.json` is under `src/`, and `tsc` emits only
  `.ts`, so the file does not reach `dist/` on build.
- Flat register list with driver-side block grouping (`maxBlockSize`,
  `gapTolerance`) versus blocks written out by hand in the file.
- Behaviour when the map is missing or fails validation at startup: exit with
  a clear error, or stay up and report the meter as BAD.
- Whether a failed read and an implausible reading need separate quality
  states or one state with a substatus.
- Clock source on the Pi after a power cut with no network.
- Whether EM111 variants (pulse, M-Bus) share one register map. Not checked.

## Sources

- `node_modules/modbus-serial/ModbusRTU.d.ts:76` and `index.js:886-892`
  (primary, read). The request frame carries slave address, function code,
  start address and register count.
- evcc device templates, one YAML per meter model, protocol details inside a
  `render` block (secondary, README read through a summariser).
- `solar-inverter-modbus-registers`, JSON profiles per inverter brand, fields
  `fc`, `addr`, `count`, `signed`, `scale`, `min`, `max` and profile-level
  `unitId`, `addressOffset`, `polling.maxBlockSize`, `polling.gapTolerance`
  (secondary, same).
- OPC UA `Uncertain_EngineeringUnitsExceeded`, "The value is outside of the
  range of values defined for this parameter" (secondary, search summary. The
  Part 8 page did not contain the table).
- EM111 word order, lower word first: read from the meter manual by the user
  (primary, not re-checked here).
