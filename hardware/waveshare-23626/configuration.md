# Waveshare 23626 configuration procedure

What to do to get this device talking Modbus TCP to the Pi, and the one
setting that decides whether the project's quality-field premise is
observable. Confidence marks are as defined in `device.md`.

## Tooling

**Vircom** is Waveshare's configuration utility. It discovers devices on the
LAN and edits their parameters. The computer running it must be on the same
local network as the module. **[MODEL]**

Vircom is obtained from the product wiki page (see
`sources.md`). It is Windows software and is not committed to this repo.

**Web UI is the alternative.** Any browser pointed at the device's IP reaches
a configuration page as long as they are in the same LAN.
A login password is now set (see `device.md` As-left,
value not recorded here or anywhere in git). **[MODEL]**

## Order of operations

The order matters: **read everything before writing anything**, because the
as-found state can only be captured once (`device.md`).

1. Power the device. 6–36 V DC on `VCC`/`GND`, or PoE, see the note on PoE
   below. **[MODEL]**
2. Reach it. Either Vircom → `Device Management` → `Auto Search`, or a
   browser at its IP. If neither finds it, the IP is unknown; a factory reset
   (hold reset pin 5 s) puts it at a known address, **but destroys the
 as-found record**, so exhaust discovery first. **[MODEL]**
3. **Record the as-found table in `device.md` now.** Before step 4.
4. Set the serial parameters to match whatever the EM111 reports from its own
   display. Change this end, not the meter.
5. Set the conversion protocol to `Modbus TCP<-->RTU`. The port changes
   itself from `4196` to `502`. **[MODEL]**
6. Choose the Modbus gateway type deliberately, see below.
7. Set a new web login password.
8. `Modify Setting`, then `Restart Dev`, then power-cycle and confirm the
   settings survived.

## The gateway-type setting

Confirmed on this unit (Vircom, `Advanced Settings` → `More Advanced
Settings...`), the firmware shows exactly these five options, current
setting in **bold**:

| Firmware label | Matches | Behaviour | Confidence |
|---|---|---|---|
| Simple modbus tcp to rtu | Simple protocol conversion | Straight RTU↔TCP translation. No arbitration, so two TCP masters collide on the RS-485 bus | **[MODEL]** |
| Multi host non storage type | Multi-host | Adds one-question-one-answer queuing so several masters can share the bus | **[MODEL]** |
| **Auto query storage type** | Storage | Gateway polls the slaves itself and answers from its own cache | **[DEVICE]**, confirmed as this unit's default |
| Pre configurable modbus GW | ZLMB configurable | Pre-configured register lists read in one batch for speed | **[DEVICE]**, behaviour not in the Spotpear guide, sibling-product line only |
| Device client & slave mode | No match in any source read so far | Unknown | **[DEVICE]**, not documented anywhere yet, might test with PI |


### Path to change it

In Vircom: `Advanced Settings` → set `Transfer Protocol` to `None` → `More
Advanced Settings...` → select the Modbus gateway type → `Modify Setting` →
`Restart Dev`. Field names come from sibling products and must
be checked against what this unit actually shows.

### Why this is the important one

The default is **storage**, per the Spotpear guide for this exact SKU.
Measured on this unit 2026-09-11 (`docs/bringup-modbus-bench.md` Phase 5):

- **Storage, healthy bus** → 11 reads from cache, up to 19 s old, then one
  timeout → `STALE`
- **Storage, bus cut** → timeout at once → `TIMEOUT`
- **Non-storage, bus cut** → timeout at once → `TIMEOUT`

The documented assumption was that storage mode keeps answering after the
bus is cut. It does not. The stale data comes from a healthy bus.

**Consequence for production configuration:** whichever mode ends up feeding
the real pipeline must be a recorded decision, not the factory default. If
storage mode is left on by accident, the pipeline receives stale data that
carries no indication it is stale.

## PoE

The device supports IEEE 802.3af. **[MODEL]** The project has no PoE injector
or PoE switch. ADR-0006 counts *not* buying them among its savings, and
ADR-0007 lists them as a cost of a rejected option. Power therefore comes
from the 24 V DIN supply (ADR-0009), which is inside the documented
6–36 V DC range.

ADR-0010 lists "PoE: yksi kaapeli riittää" as a benefit. It is a real
capability of the device and unavailable in this build.

## Resolved on the bench, 2026-08-29

These could not be resolved from documentation. Full record in
`docs/bringup-modbus-bench.md`:

| ID | Was unknown | Resolved value |
|---|---|---|
| U5 | This unit's actual IP | `192.168.50.46`, DHCP from the router, neither documented static default |
| U6 | The exact field names this unit's firmware shows for gateway type | Five options, see the table above |
| U7 | This unit's actual default baud rate | `9600 bps`, matching the meter |
