# Carlo Gavazzi Energymeter

- **SKU:** EM111DINAV81XS1X
- **Role:** Single-phase energy meter, Modbus RTU slave on the RS485 bus to
  the Waveshare gateway (DS p. 4: "Modbus RTU (slave function)").
- **Related:** ADR-0002, `configuration.md`

Confidence marks as defined in `hardware/README.md`. DS = `EM111_DS_ENG.pdf`,
CP = `EM111_EM112_ET112_CP.pdf`.

## Identity

| Field | Value | Source |
|---|---|---|
| Serial number | `163587Z` | **[DEVICE]** CG UC7 software |
| Firmware version | `B-60` | **[DEVICE]** CG UC7 software |
| Hardware revision | Not on the type plate | **[DEVICE]** type plate |

## Electrical

| Field | Value | Confidence |
|---|---|---|
| Supply voltage | 230 V AC, -30 % / +20 %, self-powered via measured voltage | **[MODEL]** IM, Technical data |
| Rated current | 32 A | **[MODEL]** DS p. 1 |
| Max current | 45 A | **[MODEL]** DS p. 1 |
| Communication | RS485 serial port, screw terminals | **[MODEL]** DS p. 4 |
| Address | 1 - 247, (default) 1 | **[MODEL]** DS p. 4 |
| Serial baud rate | 9.6 / 19.2 / 38.4 / 57.6 / 115.2 kbps, (default) 9.6 | **[MODEL]** DS p. 4, CP p. 13 |
| Parity | none (default) / even | **[MODEL]** DS p. 4, CP p. 13 |
| Stop bits | 1 (default) or 2, 2 only allowed if parity = none | **[MODEL]** CP p. 13 |
| Data refresh time | 1 s | **[MODEL]** `EM111_DS_ENG.pdf` p. 4 |

### Terminal labels

| Terminal | Function |
|---|---|
| `7` | GND |
| `5` | connect with `8` if last device in line |
| `8` | A - |
| `6` | B + |

RS485 terminals, IM Fig. 5: "terminated on the last network device
connecting terminals A- and T". **[MODEL]**

## Factory defaults

| Field | Value | Confidence |
|---|---|---|
| RS485 | `1` | **[MODEL]** |
| RS485 baud rate | `9600 bps` | **[MODEL]** |
| RS485 parity | `none` | **[MODEL]** |
| Stop bits | `1` | **[MODEL]** |
| Measurement mode | `A` (easy connection) | **[MODEL]** DS p. 9 |
| P int (W dmd integration time) | `1` min | **[MODEL]** DS p. 9 |
| Tariff | `No` | **[MODEL]** DS p. 9 |

RS485 rows: CP p. 13 (registers `2000h`-`2003h`). Measurement mode register
`1103h`: CP p. 12.

## As-found 2026-08-29

| Field | As-found value | Verified how |
|---|---|---|
| RS485 address | `1` | Read from meter's own display menu |
| Baud / parity / stop bits | `9600 bps, no parity, 1 stop bit` | Read from meter's own display menu |

Matches factory defaults above and nothing was changed.

## As-found 2026-10-27

| Field | As-found value | Verified how |
|---|---|---|
| Supply and measuring | Between `1Q1` and `1PR1`, see `docs/wiring-enclosure.md` | Inspected at the unit |
| RS485 termination | Terminals `5` and `8` bridged | Inspected at the unit |
| RS485 bus | Wired to the Waveshare gateway as in the manufacturer wiring diagram | Inspected at the unit |
| Tariff input `3`-`4` | Not connected | Inspected at the unit |

Measurement mode and P int of this unit: not yet read.

## As-left

No setting written by UC7 or Modbus since as-found 2026-08-29.