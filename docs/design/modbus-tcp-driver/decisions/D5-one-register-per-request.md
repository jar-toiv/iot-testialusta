# D5: One register per request

- **Date:** 2026-10-14
- **Status:** Accepted, first version only. Planned change below.
- **Serves:** REQ-MTD-005, REQ-MTD-007
- **Replaces:** the "Read strategy" entry in
  `register-map-and-reading-shape.md` (one block read per poll)

## Decision

Each register in the profile is read with its own request, using that
register's `adr` and `count`.

## Why

- Each register gets its own outcome, so per-register quality
  (REQ-MTD-005) and no partial decoding (REQ-MTD-007) need no extra logic.
- The profile holds one register today, so block reads would gain nothing.

The `000Bh` overlap (EM111 CP p. 8 and p. 11) is not the reason. It affects
only the identification code, which is not polled.

## Departs from

Home Assistant groups registers: with `virtual_count`, "All their registers
are read with a single request" (home-assistant.io/integrations/modbus,
read 2026-10-14).

## Planned change

Move to block reads, as Home Assistant does, when the profile grows enough
for request count to matter. Constraints from the EM111 CP:

- At most 20 words per request. p. 3 says 50 in the text but 1-20 in the
  request table, so the lower figure applies.
- A block must not cut a 2-word register in half, and must not include
  `000Bh` as a single word.
- A failed block yields BAD for every register in it, so REQ-MTD-005 needs
  restating for blocks in the same change.
