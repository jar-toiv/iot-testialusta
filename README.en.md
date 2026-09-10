*[Suomeksi](README.md) · **English***

# Iot Demo Testbed A multi-protocol demo environment for industrial IoT

A testbed cabinet has been installed in the field to collect data from fieldbuses.
I use the MQTT protocol for data collection and TypeScript for pushing it into databases.

The cabinet is later meant to be able to simulate faults that occur in the field.

## Why this exists

The purpose is to deepen my knowledge of industrial communication protocols and
devices, and to learn to build things at the code level. I also aim to document
every consideration, decision, fault and action.

Background: electrician, with IoT/cloud still to be learned.

## What is different here

Most hobby projects demo the path that works. This one deliberately also demos
the path that **fails**:

- A physical fault-injection panel (switch rail: A/B swapped, termination
  resistor disconnected, common ground broken...)
- Software simulation of network faults (`tc netem`) and cross-testing against
  a real mobile network
- Every reading carries an OPC UA -style quality field
  (`GOOD` / `UNCERTAIN` / `BAD` + substatus), not just a value
- Every architecture decision is recorded as an ADR, together with the
  alternatives that were rejected.

## Architecture

```
Field                     Edge                    Cloud
─────                     ────                    ─────
Modbus meter ───RS485───┐
Modbus sensor ──────────┤
                        └─► Waveshare ──Eth──┐
                                             ├─► Pi 4B ──4G──► broker + database
ESP32 (CN105) ──┐                           │   Mosquitto
ESP32 (analog) ─┴──WiFi (Pi's own AP)───────┘   InfluxDB, MongoDB
                                                 store-and-forward
```

Layers: **driver → normalization → quality gate → buffer → publish.**

## Protocols covered

| Protocol | Role in this project | Status |
|---|---|---|
| Modbus RTU | Energy meter, RS-485 sensor | 🟡 |
| Modbus TCP | Waveshare gateway | 🟡 |
| M-Bus | Separate meter, own parser | ⚪ |
| wM-Bus | 868 MHz, own meters only | ⚪ |
| CN105 | Reading heat pump state | ⚪ |
| 1-Wire | Temperature watchdog | ⚪ |
| Analog | Current clamp | ⚪ |
| S0 pulse | Fallback route | ⚪ |
| LoRa (P2P) | Radio link | ⚪ |
| MQTT | The entire internal message bus | ⚪ |

🟢 implemented in the pipeline · 🟡 verified on the bench, no pipeline code ·
⚪ planned

No protocol is implemented in the pipeline yet: `src/` currently contains
only the scaffold. Modbus RTU and TCP are bench-verified (every EM111
register read through the Waveshare gateway).

## Structure

```
docs/
  PROJEKTIN-TILA.md   ← starting point for new work, open questions
  adr/                ← architecture decisions, one file per decision
  vikaluettelo.md     ← observed and injected faults, metrics
src/                  ← drivers, pipeline (TypeScript)
hardware/             ← wiring diagrams, shopping list
```

## Architecture decisions

Every significant choice and every rejected alternative is recorded as an ADR:
context, alternatives, decision, consequences, verification.

→ [`docs/adr/`](docs/adr/README.md): index and all decisions

## Fault log

⚪

## Status and roadmap

- [ ] Design and device selection, ADR-0001…0019
- [ ] Modbus chain on the bench (meter → Waveshare → database)
- [ ] Enclosure and fault-injection panel
- [ ] CN105 readout from the air-source heat pump (read-only)
- [ ] Commissioning of the remote site
- [ ] Replay mode for the demo

## Author

Jarmo T a background in electrical installation, learning the IoT/cloud side
through this project.

## License

MIT [`LICENSE`](LICENSE)
