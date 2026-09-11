# Carlo Gavazzi Energymeter

- **SKU:** EM111DINAV81XS1X
- **Role:** Modbus RTU to Modbus TCP slave measurement device.
- **Related:** ADR-0002, `configuration.md` 

## Confidence levels used below

| Mark | Meaning |
|---|---|
| **[MODEL]** | Documented for this exact model. Sourced, see `sources.md` |
| **[DEVICE]** | Can only be established by reading this physical unit |

## Identity

| Field | Value | Source |
|---|---|---|
| Serial number | `163587Z` | **[DEVICE]** CG UC7 software |
| Firmware version | `B-60` | **[DEVICE]** CG UC7 software |
| Hardware revision | | **[DEVICE]** type plate |

## Electrical

| Field | Value | Confidence |
|---|---|---|
| Supply voltage | 230 V AC self, screw terminal | **[MODEL]** |
| Amperage | Up to 32 A | **[MODEL]** |
| Communication | RS485 serial port, screw term | **[MODEL]** |
| Address | 1 - 247, (default) 1 | **[MODEL]** |
| Serial baud rate | 9.6 / 19.2 / 38.4 / 57.6 / 115.2 kbps as steps, (default) 9.6  | **[MODEL]** |
| Data bits | not a configurable parameter (Modbus RTU standard, always 8) | **[MODEL]** |
| Parity | none (default) / even | **[MODEL]** |
| Stop bits | 1 (default) or 2; 2 only allowed if parity = none | **[MODEL]** |
| Data refresh time | 1 s | **[MODEL]** `EM111_DS_ENG.pdf` p. 4 |

### Terminal labels

| Terminal | Function |
|---|---|
| `7` | GND |
| `5` | connect with `8` if last device in line |
| `8` | A - |
| `6` | B + |

These terminals are for RS485 usage. see `sources.md`

## Factory defaults

| Field | Value | Confidence |
|---|---|---|
| RS485 | `1` | **[MODEL]** |
| RS485 baud rate | `9600 bps` | **[MODEL]** |
| RS485 parity | `none` | **[MODEL]** |
| Stop bits | `1` | **[MODEL]** |
| Measurement mode | `A` unidirectional | **[MODEL]** |

Source: `configuration.md` (registers `2000h`-`2004h`, `1103h`), from
`EM111_EM112_ET112_CP.pdf`.

## As-found 2026-08-29

| Field | As-found value | Verified how |
|---|---|---|
| RS485 address | `1` | Read from meter's own display menu |
| Baud / parity / stop bits | `9600 bps, no parity, 1 stop bit` | Read from meter's own display menu |

Matches factory defaults above and nothing was changed.