# Spec Delta

## Purpose
Polls Modbus field devices and turns each read, successful or failed,
into a reading for the pipeline. This is where field data enters the
system.

## ADDED Requirements

### Requirement: Device identification
The driver SHALL read the identification code from the device each time
the connection opens or reopens, and compare it with the expected code
in the device configuration.

#### Scenario: Identification code matches
- **WHEN** the connection opens and the device returns the expected
  identification code
- **THEN** the driver starts polling the device

### Requirement: Wrong device
When the identification code does not match, the driver SHALL emit one
reading with substatus `WRONG_DEVICE` and stop polling that device until
the driver restarts, without further identification attempts.

#### Scenario: Identification code does not match
- **WHEN** the connection opens and the device returns a different
  identification code
- **THEN** the driver emits one reading with substatus `WRONG_DEVICE`
  and stops polling the device

#### Scenario: Stopped device after reconnect
- **WHEN** a device has been stopped with `WRONG_DEVICE` and the
  gateway connection reopens
- **THEN** the driver neither identifies nor polls that device until
  the driver restarts

### Requirement: Identification without response
When the identification read gets no response, the driver SHALL emit a
reading with substatus `NOT_IDENTIFIED` and retry the identification at
increasing intervals.

#### Scenario: Identification read gets no response
- **WHEN** the connection opens and the identification read gets no
  response
- **THEN** the driver emits a reading with substatus `NOT_IDENTIFIED`

#### Scenario: Identification keeps failing
- **WHEN** consecutive identification reads get no response
- **THEN** the interval between identification attempts increases
  after each failure

### Requirement: Register polling
The driver SHALL read the configured registers of an identified device
over Modbus TCP through the gateway, every 5 s, on a schedule it keeps
itself (ADR-0020).

#### Scenario: Identified device is polled
- **WHEN** a device has passed identification
- **THEN** the driver reads each register configured for that device
  every 5 s

### Requirement: Poll round overrun
The driver SHALL NOT start a poll round while the previous round of the
same device is still running. A skipped round SHALL NOT be made up, and
the driver SHALL count each skipped round.

#### Scenario: Round takes longer than the interval
- **WHEN** a poll round is still running when the next 5 s tick fires
- **THEN** the driver skips that round, increments the overrun count,
  and starts the next round on the following tick

### Requirement: Raw value decoding
The driver SHALL combine the registers of a point into one raw value
according to the point's configured type and signedness and the
device profile's word order.

#### Scenario: Signed 32-bit value, low word first
- **WHEN** a signed `int32` point in a `lowFirst` profile returns the
  registers `[65483, 65535]`
- **THEN** the raw value is -53

### Requirement: Scaling to engineering units
The driver SHALL convert each raw register value to an engineering
value using the scale factor and unit configured for that point.

#### Scenario: Raw value is scaled
- **WHEN** a point with scale factor 0.1 and unit `var` has the raw
  value -53
- **THEN** the reading carries the value -5.3 with the unit `var`

### Requirement: Reading envelope
The driver SHALL produce every reading in the ADR-0004 envelope with
`source`, `value`, `unit`, `ts.edge` and `durationMs` set, and SHALL
leave the `quality` field unset. `ts.source` SHALL be absent, because
Modbus carries no timestamp.

#### Scenario: Successful read
- **WHEN** a register read succeeds
- **THEN** the driver produces a reading in the ADR-0004 envelope with
  the scaled value and no `quality`

#### Scenario: Timestamp and duration of a reading
- **WHEN** the driver produces a reading, successful or failed
- **THEN** `ts.edge` holds the time the response arrived or the timeout
  fired, `durationMs` holds the time from request to that moment, and
  `ts.source` is absent

### Requirement: Read failures as substatus
The driver SHALL report a failed read as a reading with a `substatus`
from ADR-0004 and a `null` value, and SHALL NOT throw an exception to
the next pipeline layer.

#### Scenario: Gateway connection fails
- **WHEN** the TCP connection to the gateway does not open or drops
- **THEN** the driver emits a reading with substatus `NO_CONNECTION`

#### Scenario: Register does not answer
- **WHEN** a register read does not get a response in time
- **THEN** the driver emits a reading with substatus `TIMEOUT`

#### Scenario: Connection drops during a round
- **WHEN** the gateway connection drops before all points of a round
  are read
- **THEN** the driver emits a reading with substatus `NO_CONNECTION`
  for each point not yet read in that round

#### Scenario: RS-485 bus is cut
- **WHEN** the RS-485 bus between the gateway and the device is
  disconnected
- **THEN** the driver emits a reading with substatus `TIMEOUT`
  (ADR-0020)

#### Scenario: Modbus exception response
- **WHEN** the device or gateway answers with a Modbus exception
- **THEN** the driver emits a reading with substatus `EXCEPTION` and the
  exception code in `detail`

#### Scenario: Malformed response
- **WHEN** the response is broken or has the wrong length
- **THEN** the driver emits a reading with substatus `MALFORMED`

### Requirement: Export to the next pipeline layer
The driver SHALL export its readings to the next pipeline layer.

#### Scenario: Reading is passed on
- **WHEN** the driver produces a reading, successful or failed
- **THEN** the driver hands the reading to the next pipeline layer
