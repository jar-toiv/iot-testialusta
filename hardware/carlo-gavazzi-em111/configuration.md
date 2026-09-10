# Carlo Gavazzi EM111DINAV81XS1X Modbus configuration

Source: `EM111_EM112_ET112_CP.pdf` (Communication Protocol, v2 rev14), see
`sources.md`. All addresses below are "physical address" (word address in
the Modbus frame), not the 6-digit Modicom notation the PDF also gives.

## Transport

- Protocol: Modbus RTU (slave only), functions 03h (read holding), 04h
  (read input), 06h (write single holding register), 08h (diagnostic loopback, sub-function 0000h).
- Max registers per read request: 50 words.
- Byte order within a register: MSB, LSB.
- 32-bit values the word order is LSW, MSW (low word first).
- RS485 bus must be terminated at both ends. On EM111 the far
  end is terminated by wiring terminal `8 (A)` to terminal `5 (T)` on the last
  instrument on the bus.
- Typical answering time 40 ms, max 500 ms before a query should be
  retried; after 2-3 unanswered queries treat as not connected.

## Serial port configuration registers (read/write)

| Address | Register | Values |
|---|---|---|
| `2000h` | RS485 instrument address | 1–247, default 1 |
| `2001h` | RS485 baud rate | 1=9.6k (default) / 2=19.2k / 3=38.4k / 4=57.6k / 5=115.2k |
| `2002h` | RS485 parity | 1=none (default) / 2=even |
| `2003h` | Stop bits | 1=1 (default) / 2=2, only valid if parity=none |
| `2004h` | Max words per Modbus request | 50, read-only |

## Identity

| Address | Register | Notes |
|---|---|---|
| `000Bh` | Carlo Gavazzi identification code | Expected `103` for this SKU (EM111-DIN AV8, X option) |
| `0302h` | Firmware version code | 0="A", 1="B", ... |
| `0303h` | Firmware revision code | 0="0", ... |
| `5000h`–`5006h` | Serial number, 7 ASCII chars | LSB of each word only |
| `5010h` | Production year | Manufactured after 2018-10-01 only |

## Instantaneous variables and meters (read-only, functions 03h/04h)

All INT32 unless noted. Values not listed as "n.a." in the source table for
EM111 are included; the rest is not available on this model.

| Address | Variable | Weight | Notes |
|---|---|---|---|
| `0000h` | V L-N | ×10 | |
| `0002h` | A | ×1000 | |
| `0004h` | W | ×10 | |
| `0006h` | VA | ×10 | |
| `0008h` | var | ×10 | |
| `000Ah` | W dmd | ×10 | |
| `000Ch` | W dmd peak | ×10 | |
| `000Eh` | PF | ×1000 | INT16 |
| `000Fh` | Hz | ×10 | INT16 |
| `0010h` | kWh (+) TOT | ×10 | |
| `0012h` | kvarh (+) TOT | ×10 | |
| `0014h` | kWh (+) PARTIAL | ×10 | |
| `0016h` | kvarh (+) PARTIAL | ×10 | |
| `0018h` | kWh (+) t1 | ×10 | |
| `001Ah` | kWh (+) t2 | ×10 | |
| `0020h` | kWh (-) TOT | ×10 | |
| `0022h` | kvarh (-) TOT | ×10 | |

Registers `001Ch`–`001Eh` (t3/t4), `0024h`–`002Ah` (partial/kVAh
negative-direction), `002Eh`–`0034h` (THD) and the `002Ch` hour counter
return 0. Not available on EM111.

## `000Bh` is claimed twice, so read width changes the answer

The source lists `000Bh` as the identification code, and also lists `000Ah`
W dmd as INT32, which spans `000Ah`–`000Bh`. The 2026-09-02 read shows both:
W dmd read as a 2-word pair gave `[86, 0]`, and `000Bh` read as a single
word gave `103`. Same address, different value depending on how it was
asked for.

Driver consequence: read registers individually. Grouping several into one
multi-word request is an optimisation that would silently change this
value, so it must not be added without re-verifying each register against
an individual read.

## Not covered here

Not used by this project:
M-Bus port register map, pulse output, digital input, tariff registers,
reset commands.
