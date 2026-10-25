# Enclosure Wiring

- **Revision:** 3
- **Date:** 2026-10-25
- **Related:** ADR-0009 (parts and branch-topology decision),
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
                             ├───N────► 1Q1 N ───────────────────► ABB suko N
                             │
                             └───L────► 1F1 1→2
                                         │
                                         ├───L───► 1X: 230 VAC
                                         │
                                         └───L───► 1Q1 L 1→2 ───► ABB suko L
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


## 24V DC circuit (Waveshare)

```text
1X: 230 VAC
 │
 └──────► 1PWR1 Mornsun LI30-20B24PR2
           │
           └───24 V DC───► 1X: 24 VDC
                            │
                            └──────► 1GTW1 Waveshare
```

### Devices

| Designation | Device | Part | Rating |
|---|---|---|---|
| 1PWR1 | DIN power supply | Mornsun LI30-20B24PR2 | 24 V 1.5 A 30 W |
| 1GTW1 | RS-485 to Ethernet gateway | Waveshare 23626 | 6-36 V DC input |

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