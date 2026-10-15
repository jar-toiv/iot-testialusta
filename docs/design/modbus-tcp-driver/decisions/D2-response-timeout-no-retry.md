# D2: Response timeout 500 ms, no retry within a cycle

- **Date:** 2026-10-14
- **Status:** Accepted, first version only. Planned change below.
- **Serves:** REQ-MTD-003, NFR-MTD-002

## Decision

MTD waits 500 ms for each answer. An unanswered query is not retried within
the cycle: the register gets `value: null`, `BAD`, `TIMEOUT`, and the next
cycle asks again.

## Why

- 500 ms is the EM111 CP's max answering time (§1.3.2).
- NFR-MTD-002's 1 s limit assumes no retry.
- The next cycle stands in for the repeat the CP asks for. This holds only
  while the polling interval is short.
- Counting consecutive misses ("2 or 3 consecutive queries") is left to the
  quality gate, which sees the history. The driver does not.

## Departs from

- EM111 CP §1.3.1 item 5: "If an instrument does not answer within the 'max
  answering time', it is necessary to repeat the query. If the instrument
  does not answer after 2 or 3 consecutive queries, it is to be considered
  as not connected, faulty or reached with a wrong address."
- Home Assistant: `homeassistant/components/modbus/modbus.py` builds its
  client with `"retries": 3`, not user-configurable. Read 2026-10-14.

## Planned change

Move to a retry within the cycle, as the CP and Home Assistant do, once the
first version runs. The retry count becomes a gateway-level setting next to
`responseTimeoutMs` (D4). NFR-MTD-002's 1 s figure must be revised in the
same change, since one register can then take up to 1.5 s.
