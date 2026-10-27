# Telegraf Modbus and OPC UA input plugins

- **Kind:** Primary (README and source code)
- **Repo:** https://github.com/influxdata/telegraf, read on `master`.
  HEAD at time of writing: `2bac12a6a682e02f2ef42a43d40a259083892212`
- **Read:** 2026-10-15
- **Used by:** ADR-0004 ("Mitä tämä sulkee pois", Telegraf paragraph)

## `plugins/inputs/modbus/README.md`

- "Using the `name` setting you can specify the field-name in the metric as
  output by the plugin."
- Metrics section: "There is no predefined metric format."
- No quality, status or error field is described. Example output holds only
  `energy`, `power`, `frequency`.
- Nothing on what happens to a failed read. Only workarounds:
  - `timeout`: "Timeout for each request."
  - `busy_retries`: "Maximum number of retries and the time to wait between retries."
  - `one_request_per_field`: "Force the plugin to read each field in a separate request."
  - `pause_between_requests`: "Pause between read requests sent to the device."

## `plugins/inputs/opcua/README.md`

`Quality` appears only in example output, `Quality="OK (0x0)"`. Not
described in the text.

## `plugins/common/opcua/input/input_client.go`

In `UpdateNodeValue`:

```go
o.LastReceivedData[nodeIdx].Quality = d.Status
```

In `MetricForNode`:

```go
fields["Quality"] = strings.TrimSpace(o.LastReceivedData[nodeIdx].Quality.Error())
```

The OPC UA plugin passes the protocol's `StatusCode` through. The Modbus
plugin has no such field because Modbus has no per-value status (see
`modbus-application-protocol.md`), and the plugin does not derive one from
failures.
