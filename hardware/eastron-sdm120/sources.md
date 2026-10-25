# Eastron SDM120 documentation

Device not purchased. Retrieved 2026-10-25.

## Primary, SDM120-M (Modbus model)

| Source | Used for |
|---|---|
| Eastron SDM120-M User Manual V1.0 (https://www.eastrongroup.com/eastrongroup/2025/03/22/eastronsdm120-musermanualv1.0.pdf), local `eastronsdm120-musermanualv1.0.pdf`, SHA-256 `0de13400ee283a7f059b04124454e43dd7494435f2332cefcb639e53f2eb4f1e` | Function codes, register format |

Quotes:

- p. 1: "RS485 Modbus RTU"
- p. 11, Modbus register Map: "04 to read input parameters". Measured
  values (Voltage, Current, Active power ...) listed with Format "Float".
- p. 12: "10 to set holding parameter", "03 to read holding parameter".
  Holding registers hold settings (Demand Period, Baud rate, Meter ID ...).
- Word or byte order of Float values: not stated anywhere in pp. 1-13.

## Not found

- SDM120-MBus (M-Bus model) manual: two web searches on 2026-10-25 found
  no manufacturer document.
