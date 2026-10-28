# Enclosure Wiring

- **Revision:** 5
- **Date:** 2026-10-27
- **Related:** ADR-0009 (enclosure choice),
  `docs/bringup-enclosure-assembly.md`

## Verification

- [x] Checked against a photo of the assembled enclosure
- [x] Checked against the physical unit, breaker by breaker, before
      energising
- [x] Terminal numbers on each device confirmed against its own datasheet
      or nameplate (this diagram does not assert exact terminal numbers
      unless a datasheet was checked)
- [ ] Protective earth continuity test
- [ ] Insulation resistance test

## Revision log

| Rev | Date | Change |
|---|---|---|
| 1 | 2026-09-09 | First version: main circuit, 5V and 24V DC circuits |
| 2 | 2026-09-09 | Verification completed: checked against photo, checked against physical unit breaker by breaker, terminal numbers confirmed against datasheet/nameplate |
| 3 | 2026-10-25 | Corrected to the physical unit: one breaker 1F1 feeds both the DC supplies and 1Q1 (there is no second breaker), RCD part number GWD4032, device designations added. Verification in progress: earth continuity and insulation resistance pending |
| 4 | 2026-10-26 | TSW010 switch added on 1X: 24 VDC |
| 5 | 2026-10-27 | EM111 added between 1Q1 and 1PR1, as inspected at the unit |

## Main circuit (230V AC)

```text
1XP1 IEC C14 inlet
 │
 └───L, N───► 1S1 Main switch
               │
               └───L, N───► 1X1 (L, N, PE)
                             │
                             ├───PE───► PE rail
                             │
                             ├───N────► N rail
                             │
                             ├───N────► 1Q1 N, 4 ──────────► EM111 N ────────► 1PR1 N
                             │
                             └───L────► 1F1
                                         │
                                         ├──L──► 1X: 230 VAC
                                         │
                                         └──L──► 1Q1 L ────► (1) EM111 (2) ──► 1PR1 L
```

### Devices

| Designation | Device | Part | Rating |
|---|---|---|---|
| 1XP1 | IEC C14 inlet | GSD336-63 | 10 A 250 V |
| 1S1 | Main switch | B448PUIP65 | 2-pole 16 A IP65 |
| 1X1, 1X | Terminal blocks (all) | WAGO 2002 | 2.5 mm² |
| 1F1 | Circuit breaker | GW92006 | 1x10A C |
| 1Q1 | RCD | GWD4032 | 2x40A 30mA type A |
| 1PR1 | DIN socket (P30) | ABB M1173 | 16 A 250 V |
| 1EM1 | Energy meter | Carlo Gavazzi EM111DINAV81XS1X | 32 A rated, 45 A max |

EM111 terminals 5 and 8 are bridged (bus termination). RS485 terminals go
to 1GTW1 Waveshare. Tariff input 3-4 is not connected. Details:
`hardware/carlo-gavazzi-em111/device.md`.


## 24V DC circuit (Waveshare, switch)

```text
1X: 230 VAC
 │
 └──────► 1PWR1 Mornsun LI30-20B24PR2
           │
           └───24 V DC───► 1X: 24 VDC
                            │
                            ├──────► 1GTW1 Waveshare
                            │
                            └──────► 1ETH1 Teltonika TSW010
```

### Devices

| Designation | Device | Part | Rating |
|---|---|---|---|
| 1PWR1 | DIN power supply | Mornsun LI30-20B24PR2 | 24 V 1.5 A 30 W |
| 1GTW1 | RS-485 to Ethernet gateway | Waveshare 23626 | 6-36 V DC input |
| 1ETH1 | Ethernet switch | Teltonika TSW010 | 9-30 V DC input |

## 5V DC circuit (Pi)

```text
1X: 230 VAC
 │
 └──────► 1PWR2 Mean Well HDR-15-5
           │
           └───5 V DC───► 1X: 5 VDC
                           │
                           └──────► 1PI1 Raspberry Pi 
```

### Devices

| Designation | Device | Part | Rating |
|---|---|---|---|
| 1PWR2 | DIN power supply | Mean Well HDR-15-5 | 5 V 2.4 A 12 W |
| 1PI1 | Single-board computer | Raspberry Pi 4B | |

## Bill of materials

| Part | Model/code | Role | excl. VAT (€) | VAT 25.5 % (€) |
|---|---|---|---|---|
| Modular enclosure, surface, 24-mod, IP65 | PC GW40104BS | Enclosure | 61.45 | 77.12 |
| Terminal block WAGO 3N, blue, 2 pcs | 2002-1304 | Field wiring | 1.71 | 2.15 |
| Terminal block WAGO, green-yellow, 2 pcs | 2002-1304 | " | 3.16 | 3.97 |
| Terminal block WAGO, grey, 8 pcs | 2002-1304 | " | 6.82 | 8.56 |
| Circuit breaker 1x10A, C curve | GW92006 | 1F1, DC supplies and RCD branch | 2.15 | 2.70 |
| RCD 30mA/2x40A, type A | GWD4032 | Measured load branch | 29.29 | 36.76 |
| DIN power supply 5V 2.4A 12W | Mean Well HDR-15-5 | Pi supply | 18.90 | 23.72 |
| DIN power supply 24V 1.5A 30W | Mornsun LI30-20B24PR2 | Waveshare supply | (19.58) | (24.58) |
| IEC C14 panel inlet, male, 10A 250V | GSD336-63 | Detachable mains cord | 3.20 | 4.02 |
| Rocker switch 2-pole ON-OFF 16A, IP65, indicator | B448PUIP65 | Main switch | 4.90 | 6.15 |
| ABB DIN socket | M1173 | Reserve for later additions | 12.00 | 15.06 |
| Cable gland PG13.5, IP68, 6-12 mm, 3 pcs | WISKA HF-SKV | Strain relief for field cables | 6.00 | 7.53 |
| **Total** | | | **149.58** | **187.72** |

In parentheses: donated part, not included in the total. The price is a
reference price for a current equivalent (Mean Well HDR-30-24).

Price sources are deliberately not listed. The purchasing channel is kept
private.

## Open

- Fuses to protect the 24 VDC and 5 VDC power supplies
- Surge protection