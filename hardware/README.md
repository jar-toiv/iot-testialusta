# Hardware records

One folder per physical device, holding what the device actually is, not
what it is supposed to be. Design decisions belong in `docs/adr/`.

## Why two states, not one

Standard as-found / as-left practice: **as-found** is what a device's
settings were before anyone here touched it, **as-left** is what they were
set to and when. A second-hand or previously-configured device may
carry settings from its last owner; without a record, a mismatch discovered
later is unexplainable.

## Confidence marks

Documentation research and reading the physical unit are not the same thing.
Every value carries one of:

- **[MODEL]**  documented for this exact model, with a source
- **[DEVICE]**  establishable only by reading the unit in front of you

## Layout

```
hardware/
  <device-slug>/
    device.md          identity, spec, factory defaults, as-found, as-left
    configuration.md   how to configure it, and which settings matter
    sources.md         every URL behind every claim
    *.pdf, *.docx      manufacturer documents, the primary sources
```

## Index

| Device | Slug | Related |
|---|---|---|
| Waveshare RS232/485/422 TO POE ETH (B), SKU 23626 | [waveshare-23626](waveshare-23626/device.md) | ADR-0020 (replaces ADR-0010) |
| Carlo Gavazzi EM111-DIN.AV8.1.X.S1.X | [CG EM111-S1](carlo-gavazzi-em111/device.md) | ADR-0002 |
| Teltonika TSW010 | [teltonika-tsw010](teltonika-tsw010/device.md) | |
| ZTE 4G router, model to be filled in | [zte-4g-router](zte-4g-router/device.md) | |
