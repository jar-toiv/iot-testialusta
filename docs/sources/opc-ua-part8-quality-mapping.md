# OPC UA Part 8, A.4.3.3 Quality

- **Kind:** Primary
- **Version:** OPC 10000-8 (version shown on the page not recorded)
- **URL:** https://reference.opcfoundation.org/specs/OPC-10000-8/a-4-3-3
- **Read:** 2026-10-15
- **Used by:** ADR-0004 (OPC UA column of the Modbus TCP substatus table)

## Table A.7, Quality mapping (OPC UA StatusCode -> OPC DA quality)

| OPC UA | OPC DA |
|---|---|
| Good | GOOD |
| Good_LocalOverride | LOCAL_OVERRIDE |
| Uncertain | UNCERTAIN |
| Uncertain_SubNormal | SUB_NORMAL |
| Uncertain_SensorNotAccurate | SENSOR_CAL |
| Uncertain_EngineeringUnitsExceeded | EGU_EXCEEDED |
| Uncertain_LastUsableValue | LAST_USABLE |
| Bad | BAD |
| Bad_ConfigurationError | CONFIG_ERROR |
| Bad_NotConnected | NOT_CONNECTED |
| Bad_NoCommunication | COMM_FAILURE |
| Bad_OutOfService | OUT_OF_SERVICE |
| Bad_DeviceFailure | DEVICE_FAILURE |
| Bad_SensorFailure | SENSOR_FAILURE |
| Bad_WaitingForInitialData | WAITING_FOR_INITIAL_DATA |
