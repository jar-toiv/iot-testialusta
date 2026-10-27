# OPC UA Part 4, §7.11 DataValue

- **Kind:** Primary
- **Version:** OPC 10000-4 v1.05
- **URL:** https://reference.opcfoundation.org/Core/Part4/v105/docs/7.11
- **Read:** 2026-10-15
- **Used by:** ADR-0004 (`ts.source`, `ts.ingest`, quality per value)

## Table 131, DataValue

| Name | Type | Description |
|---|---|---|
| value | BaseDataType | "The data value. If the StatusCode indicates an error then the value is to be ignored and the Server shall set it to null." |
| statusCode | StatusCode | "The StatusCode that defines the Server's ability to access/provide the value. The StatusCode type is defined in 7.38" |
| sourceTimestamp | UtcTime | "The source timestamp for the value." |
| serverTimestamp | UtcTime | "The Server timestamp for the value." |

(`sourcePicoSeconds` and `serverPicoSeconds` omitted.)

## §7.11.3 and §7.11.4 (paraphrase, not quotes)

- sourceTimestamp is applied by the data source, reflects when the value or
  StatusCode last changed, is UTC, generated as close to the source as
  possible. Null when the source is unavailable, e.g. "the sourceTimestamp
  shall be null" when a read fails due to invalid request arguments.
- serverTimestamp is set by the Server and reflects when it received the
  value or knew it to be accurate.
