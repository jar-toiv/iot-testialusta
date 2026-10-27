# Victron dbus-modbus-client

- **Kind:** Primary (source code)
- **Repo:** https://github.com/victronenergy/dbus-modbus-client, read on
  `master`. HEAD at time of writing: `fe12d8c9c30fab4310e16c10bbec0ced4ca9926f`
- **Read:** 2026-10-15
- **Used by:** D7, REQ-MTD-013 (identify first, drop the device on failure)

## `carlo_gavazzi.py`

Model identification from register `0x000b`, the same register as D7:

```python
probe.add_handler(probe.ModelRegister(Reg_u16(0x000b), models,
```

`models` maps the register value to a model name and handler, e.g.
`1648` -> `'EM24DINAV23XE1X'` (six EM24 entries, all `EM24_Meter`). No
EM111 or ET112 entry.

Info registers, read once at init by `self.read_info()`, not polled:

```python
Reg_ver( 0x0304, '/FirmwareVersion'),
Reg_text(0x5000, 7, '/Serial'),
```

## `probe.py`, `ModelRegister.probe`

```python
for acs in self.access:
    rr = modbus.read_registers(self.reg.base, self.reg.count,
                               acs, unit=spec.unit)
    if not rr.isError():
        break
```

```python
if rr.isError():
    log.debug('%s: %s', modbus, rr)
    return None
```

```python
self.reg.decode(rr.registers)
m = self.models[self.reg.value]
return m['handler'](spec, modbus, m['model'])
```

An unknown ID raises `KeyError`, caught by a bare `except:` that returns
`None`. A failed device goes on the `failed` list.

## `device.py`, `read_info`

```python
if not self.info:
    self.read_info_regs(self.info)
```

`read_register` on failure:

```python
self.log.error('Error reading register %#04x: %s', reg.base, rr)
raise Exception(rr)
```

Not caught in `ModbusDevice.init`, so `init_dbus()` never runs and the
device gets no D-Bus service. Whether the caller retries was not read.
