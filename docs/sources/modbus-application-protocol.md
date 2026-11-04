# Modbus Application Protocol Specification V1.1b

- **Kind:** Primary
- **Version read:** V1.1b, Modbus-IDA, December 28, 2006. V1.1b3 (2012) is
  the current version but every copy tried returned 404 on 2026-10-15
  (modbus.org, anleitung.smart-dog.eu).
- **URL:** https://millenia.cars.aps.anl.gov/software/epics/Modbus_Application_Protocol_V1_1b.pdf
  (mirror, redirected from cars.uchicago.edu)
- **Read:** 2026-10-15, by eye (PDF pages 15-16). §7: 2026-11-04, by eye
  (PDF pages 48-50)
- **Local copy:** `pdf/Modbus_Application_Protocol_V1_1b.pdf`
- **Used by:** ADR-0004 (Telegraf paragraph), REQ-MTD-006, REQ-MTD-007,
  change `add-modbus-tcp-driver` (§7)

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

## §7 MODBUS Exception Responses, pp. 48-50

A communication error gives no response at all, p. 48: "If the server
receives the request, but detects a communication error (parity, LRC,
CRC, ...), no response is returned. The client program will eventually
process a timeout condition for the request."

An exception response sets the MSB of the function code: "the function
code value in an exception response exactly 80 hexadecimal higher than the
value would be for a normal response" (p. 48).

| Code | Name | Meaning, quoted (pp. 49-50) |
|---|---|---|
| 01 | ILLEGAL FUNCTION | "not an allowable action for the server"; "could also indicate that the server (or slave) is in the wrong state ... because it is unconfigured" |
| 02 | ILLEGAL DATA ADDRESS | "the combination of reference number and transfer length is invalid" |
| 03 | ILLEGAL DATA VALUE | "a fault in the structure of the remainder of a complex request" |
| 04 | SLAVE DEVICE FAILURE | "An unrecoverable error occurred while the server (or slave) was attempting to perform the requested action." |
| 05 | ACKNOWLEDGE | "Specialized use in conjunction with programming commands." |
| 06 | SLAVE DEVICE BUSY | "Specialized use in conjunction with programming commands." |
| 08 | MEMORY PARITY ERROR | "Specialized use in conjunction with function codes 20 and 21" |
| 0A | GATEWAY PATH UNAVAILABLE | "Usually means that the gateway is misconfigured or overloaded." |
| 0B | GATEWAY TARGET DEVICE FAILED TO RESPOND | "Usually means that the device is not present on the network." |

## modbus-serial 8.0.25, how the codes reach the caller

Source: `node_modules/modbus-serial/index.js`, read 2026-11-04.

- Exception: lines 489-496 reject with `error.modbusCode = errorCode`.
  Message table for codes 0-11 at lines 36-49, unknown codes get
  "Unknown error" with the number kept.
- Timeout: `errno = "ETIMEDOUT"`, lines 33-34 and 65-68.
- A response arriving after its timeout fired is dropped without a
  callback, lines 455-458. Responses are matched to requests by the
  Modbus TCP transaction ID, line 418.
