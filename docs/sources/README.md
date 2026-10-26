# Sources

Saved copies of external sources that decisions rest on, so they are not
fetched again. One file per source: URL, version, date read, verbatim
quotes with section numbers, and what in this project relies on it.
Device datasheets stay in `hardware/<device>/`.

Before fetching a source, check here. After fetching one, add it here in
the same session.

**How it was read** is stated per file:

- *By eye*: the page or PDF image was read directly.
- *Via WebFetch*: the page went through a summarising model that returned
  the quotes. Quotes are likely exact but were not compared to the page by
  eye.

PDFs are kept locally in `pdf/`, which git ignores (licences restrict
redistribution). The quotes here are what the repo relies on.

Planned, not done: save the full page text of each source in `raw/`
(gitignored) and grep it instead of quoting through WebFetch. The hook
would then match the `**URL:**` line exactly instead of any substring.

| Source | File | Used by |
|---|---|---|
| Modbus Application Protocol V1.1b | [modbus-application-protocol.md](modbus-application-protocol.md) | ADR-0004, REQ-MTD-003, 006, 007, MTD design.md `0Bh` |
| OPC UA Part 4, DataValue | [opc-ua-part4-datavalue.md](opc-ua-part4-datavalue.md) | ADR-0004 (`ts`, substatus) |
| OPC UA Part 8, quality mapping | [opc-ua-part8-quality-mapping.md](opc-ua-part8-quality-mapping.md) | ADR-0004 (substatus table) |
| Telegraf Modbus and OPC UA plugins | [telegraf-modbus-opcua.md](telegraf-modbus-opcua.md) | ADR-0004 |
| Revolution Pi Connect family datasheet | [revolution-pi.md](revolution-pi.md) | ADR-0001 alternative B |
| Victron dbus-modbus-client | [victron-dbus-modbus-client.md](victron-dbus-modbus-client.md) | D7, REQ-MTD-013 |
| pysunspec2 | [pysunspec2-scan.md](pysunspec2-scan.md) | D7 discussion, substatus |
| node-red-contrib-modbus | [node-red-contrib-modbus-fsm.md](node-red-contrib-modbus-fsm.md) | MTD design.md connection diagram |
| Raspberry Pi `get_throttled` | [raspberry-pi-get-throttled.md](raspberry-pi-get-throttled.md) | ADR-0001 Todennus |
| Waveshare RS232/485/422 TO POE ETH (B) wiki | `hardware/waveshare-23626/sources.md` | MTD design.md open questions |
| Telegraf agent, gather overrun | [telegraf-agent-gather-overrun.md](telegraf-agent-gather-overrun.md) | MTD design.md cycle overrun |
| Java `ScheduledExecutorService` | [java-scheduledexecutorservice.md](java-scheduledexecutorservice.md) | MTD design.md cycle overrun |
| Prometheus scrape offset | [prometheus-scrape-offset.md](prometheus-scrape-offset.md) | REQ-MTD-001 grid anchor |
| Telegraf `round_interval` | [telegraf-round-interval.md](telegraf-round-interval.md) | REQ-MTD-001 grid anchor |
| GitHub spec-kit v1.2.2 | [github-spec-kit.md](github-spec-kit.md) | SDD migration plan |
