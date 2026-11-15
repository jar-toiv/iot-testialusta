# Proposal

## Why

Nothing reads energy meter yet. The Waveshare gateway runs in
Simple mode (ADR-0020), so polling the meter belongs to a driver, the
first layer of the pipeline.

## What Changes

- A Modbus TCP driver reads energy meter through the Waveshare
  gateway.
- The driver produces readings in the ADR-0004 `envelope` and leaves the
  `quality` field unset.
- Read failures become a `substatus` on the reading instead of an
  exception.
- The meter identification code is checked when the connection opens
  and reopens.
- Raw register values are scaled to engineering units using a scale
  factor and a unit from configuration. Configuration has a device level
  and a point level. Its file format is open.
- The driver exports its readings to the next pipeline layer.
- Out of scope: `quality`, `STALE` detection and the quality gate.

## Capabilities

### New Capabilities

- `modbus-tcp-device-polling`: The driver polls a Modbus field device
  through the gateway and produces each reading in the ADR-0004
  envelope. A failed read becomes a `substatus` on the reading instead
  of an exception. The driver passes its readings to the next pipeline
  layer.

### Modified Capabilities
  None

## Impact

- **Code:** new `src/drivers/modbus/driver.ts` and a new file for the
  ADR-0004 `Reading` type (location decided in design). Uses
  `src/config/`, `src/schemas/` and `src/index.ts`.
- **APIs:** The driver exports readings in the ADR-0004 envelope to the next pipeline layer.
- **Dependencies:** The driver uses the `modbus-serial` library to poll the field device.
- **Systems:** The driver polls the gateway over Modbus TCP. The gateway converts the requests to Modbus RTU
  over RS-485 for the field device (ADR-0020).
