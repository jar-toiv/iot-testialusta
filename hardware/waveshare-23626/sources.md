# Waveshare 23626 — documentation sources

Every claim in `device.md` and `configuration.md` traces to one of these.
Retrieved 2026-08-28.

## Primary this exact model

| Source | URL | Used for |
|---|---|---|
| Waveshare wiki, product page | https://www.waveshare.com/wiki/RS232/485/422_TO_POE_ETH_(B) | Feature set, work modes, Vircom usage |
| Waveshare product page | https://www.waveshare.com/rs232-485-422-to-poe-eth-b.htm | SKU 23626, ordering |
| Spotpear user guide (English) | https://spotpear.com/index/study/detail/id/837.html | Port 4196→502, no factory password, 5 s reset, Vircom steps, Modbus gateway storage-mode default, multi-host mode |
| Manuals.plus user manual | https://manuals.plus/ae/1005010120352492 | 6–36 V DC, IEEE 802.3af, RA/RB/TA/TB/GND/VCC terminals (its RS485 pin assignment is wrong, see `device.md`) |
| `EN-RS485-TO-ETH-B-MQTT-and-json-user-manual2.pdf` (local) | Waveshare MQTT and JSON manual | Gateway's own Modbus polling and MQTT publish, offline-as-0 behaviour (s. 3.8-3.9), ZLAN tool name (p. 29) |
| `RS485 TO ETH code Serial port modification parameters...docx` (local) | Waveshare/ZLAN parameter protocol | Serial command protocol, `QueryOneAckOneMaxWait` multi-host parameter. Nothing on storage-mode refresh |
| ZLAN "The Modbus gateway can be configured" (ZL DUI 20190714) | https://www.zlan-iot.com/download/configurable_modbus_gateway_zlmb.pdf | ZLMB mode: gateway polls configured registers itself from power-on, Vircom steps, offline value 0 / special / hold, firmware requirements for ZLAN5143 and 7144 |
| Wiki mirror (PDF) | https://www.emorex.co/wp-content/uploads/2024/12/RS232_485_422-TO-POE-ETH-B-Waveshare-Wiki.pdf | Confirms SKU 23626 and 24759 share this product page |

## Read 2026-10-15 (via WebFetch)

From the Waveshare wiki product page above, for the MTD design.md open
questions:

- RS485 terminals: "RS485 must be connected by the positive pole to the TA,
  the negative pole to the TB". Terminal type and wires per terminal not
  stated. No maximum device count on this page.
- Termination: for long buses with several devices, 120 Ω resistors at each
  end of the bus. For short distance "you can remove the two 120Ω terminal
  matching resistors of RS422/RS485 and set the jumper cap to NC."
- "It supports 30 TCP connections as a TCP server and 7 destination IPs as a
  TCP client."
- Multi-host: "In the query mode of one question and one answer, it supports
  the network port to allow multiple computers".
- Default Modbus mode is storage mode, which "will automatically train the
  query commands".

## Software

**Vircom** Waveshare's Windows configuration tool, linked from the product
wiki page.
