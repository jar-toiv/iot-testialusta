# pysunspec2 `scan()`

- **Kind:** Primary (source code)
- **Repo:** https://github.com/sunspec/pysunspec2, file
  `sunspec2/modbus/client.py`, read on `master`. HEAD at time of writing:
  `8606a884c17a8d70d209dc4ef3898226687f03c5`
- **Read:** 2026-10-15
- **Used by:** D7 discussion (identify before reading), substatus discussion
  (no answer vs wrong device kept apart)

```python
self.base_addr_list = [40000, 0, 50000]
```

```python
data = self.read(addr, 3)
if data:
    if data[:4] == b'SunS':
        self.base_addr = addr
        break
```

Per-address errors kept apart:

- empty response: `error_dict[addr] = 'Data time out'`
- answer without the marker: `error_dict[addr] = 'Device responded - not SunSpec register map'`
- exception: `error_dict[addr] = str(e)`

No marker at any address: `raise SunSpecModbusClientError(error)`, message
starting `'Error scanning SunSpec base addresses. \n'`.
