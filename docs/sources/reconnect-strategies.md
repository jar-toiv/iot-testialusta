# Reconnect strategies in client libraries

- **Kind:** Primary (README, source code and man page), quotes extracted
  with a fetch tool, not compared by eye
- **Read:** 2026-11-04. Repos read on their default branch, HEAD not recorded.
- **Used by:** change `add-modbus-tcp-driver` (connection recovery options)

## Telegraf Modbus input, `plugins/inputs/modbus/modbus.go`

https://github.com/influxdata/telegraf, branch `master`.

Connect at the start of each gather when not connected:

```go
if !m.isConnected {
if err := m.connect(ctx); err != nil {
return err
```

On a failed slave read (other than device busy) it disconnects and
reconnects within the same gather. Option `CloseAfterGather` closes the
connection after every gather.

## MQTT.js, `README.md`

https://github.com/mqttjs/MQTT.js, branch `main`.

"`reconnectPeriod`: `1000` milliseconds, interval between two
reconnections. Disable auto reconnect by setting to `0`."

## pymodbus, `pymodbus/client/tcp.py`

https://github.com/pymodbus-dev/pymodbus, branch `dev`.

- "reconnect_delay doubles automatically with each unsuccessful connect,
  from reconnect_delay to reconnect_delay_max."
- Sync client: ":param reconnect_delay: Not used in the sync client"

## paho-mqtt (Python), `src/paho/mqtt/client.py`

https://github.com/eclipse-paho/paho.mqtt.python, branch `master`.

`reconnect_delay_set(self, min_delay: int = 1, max_delay: int = 120)`:
"When connection is lost, wait initially min_delay seconds and double this
time every attempt." "The wait is capped at max_delay."

## node-red-contrib-modbus, `src/modbus-client.html`

https://github.com/BiancoRoyal/node-red-contrib-modbus, branch `master`.

- Default `reconnectTimeout: {value: 2000}`.
- "From the fourth attempt of one outage on the delay doubles up to about
  30 s (±10 % jitter)"

## systemd, `systemd.unit(5)`

https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html

- "Units which are started more than burst times within an interval time
  span are not permitted to start any more."
- "units which are configured for Restart=, and which reach the start limit
  are not attempted to be restarted anymore"
