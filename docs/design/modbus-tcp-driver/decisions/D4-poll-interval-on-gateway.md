# D4: Polling interval and response timeout live on the gateway

- **Date:** 2026-10-14
- **Status:** Accepted
- **Serves:** REQ-MTD-001, REQ-MTD-003

## Decision

The gateway config file carries `pollIntervalMs` and `responseTimeoutMs` at
gateway level, not per slave and not in the device profile.

## Why

- One bus, one cycle clock. The gateway does not queue (ADR-0020 option A),
  so every slave behind it shares one cycle.
- The device profile holds only what is true for every unit of that model.
  A polling interval is a property of the installation.
- `responseTimeoutMs` starts at 500 (D2).
- `pollIntervalMs` starts at 1000. The meter refreshes its values every 1 s
  (`docs/bringup-modbus-bench.md`, phase 5), so faster polling returns the
  same value. Short enough for D2's reasoning to hold.
