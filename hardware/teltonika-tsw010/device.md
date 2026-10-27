# Teltonika TSW010

- **Role:** Ethernet switch in the cabinet: Pi, Waveshare gateway and the ZTE router
- **Related:** `configuration.md`, `sources.md`, `docs/wiring-enclosure.md`

Confidence marks as defined in `hardware/README.md`. Page numbers (p. N)
refer to `Datasheet_TSW010_1.03.pdf`.

## Identity

| Field | Value | Source |
|---|---|---|
| Serial number | Omitted, not stored in git | **[DEVICE]** type plate |
| Hardware revision | Omitted, not stored in git | **[DEVICE]** type plate |
| Order code | Unknown: not on the type plate. All three variants accept 9-30 V DC | variants p. 6 |

## Electrical

| Field | Value | Confidence |
|---|---|---|
| Supply voltage | 9-30 V DC | **[MODEL]** p. 2 |
| Power consumption | Max 0.9 W | **[MODEL]** p. 2 |
| Ethernet | 5 × RJ45, 10/100 Mbps, auto MDI/MDIX | **[MODEL]** p. 2 |
| Management | None | **[MODEL]** p. 1 |

### Terminal labels

| Terminal | Function |
|---|---|
| `+` | Power |
| `-` | Ground |

## As-found 2026-10-26

```text
ZTE (SIM) ──Eth──► TSW010 port 5
                    │
                    ├───port 3───► 1PI1 Raspberry Pi
                    │
                    └───port 4───► 1GTW1 Waveshare
```

Ports 1 and 2 are free. Supply: 1PWR1, 24 V DC.
