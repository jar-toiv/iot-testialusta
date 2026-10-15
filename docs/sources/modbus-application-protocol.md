# Modbus Application Protocol Specification V1.1b

- **Kind:** Primary
- **Version read:** V1.1b, Modbus-IDA, December 28, 2006. V1.1b3 (2012) is
  the current version but every copy tried returned 404 on 2026-10-15
  (modbus.org, anleitung.smart-dog.eu).
- **URL:** https://millenia.cars.aps.anl.gov/software/epics/Modbus_Application_Protocol_V1_1b.pdf
  (mirror, redirected from cars.uchicago.edu)
- **Read:** 2026-10-15, by eye (PDF pages 15-16)
- **Local copy:** `pdf/Modbus_Application_Protocol_V1_1b.pdf`
- **Used by:** ADR-0004 (Telegraf paragraph), REQ-MTD-006, REQ-MTD-007

## §6.3 03 (0x03) Read Holding Registers, p. 15

Response:

| Field | Size | Value |
|---|---|---|
| Function code | 1 Byte | 0x03 |
| Byte count | 1 Byte | 2 x N* |
| Register value | N* x 2 Bytes | |

"*N = Quantity of Registers"

Error:

| Field | Size | Value |
|---|---|---|
| Error code | 1 Byte | 0x83 |
| Exception code | 1 Byte | 01 or 02 or 03 or 04 |

No per-register status or quality field. A request succeeds or fails as a
whole.

## §6.4 04 (0x04) Read Input Registers, p. 16

Same shape: Function code 0x04, Byte count 2 x N, Input Registers N x 2
Bytes. Error code 0x84, Exception code 01-04.

## Figure 13, Read Holding Registers state diagram, p. 16

Server side: ExceptionCode 01 when the function code is unsupported, 03
when the quantity is outside 0x0001-0x007D, 02 when the start address or
start + quantity is not OK, 04 when ReadMultipleRegisters fails.
