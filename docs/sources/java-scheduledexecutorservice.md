# Java `ScheduledExecutorService`

- **Kind:** Primary (official API reference)
- **URL:** https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ScheduledExecutorService.html
- **Version:** Java SE 21
- **Read:** 2026-10-19, via WebFetch
- **Used by:** MTD design.md, Error handling item 4 (cycle overrun)

## `scheduleAtFixedRate`

- "If any execution of this task takes longer than its period, then
  subsequent executions may start late, but will not concurrently execute."

## `scheduleWithFixedDelay`

- "Submits a periodic action that becomes enabled first after the given
  initial delay, and subsequently with the given delay between the
  termination of one execution and the commencement of the next."
- No sentence on an execution running longer than the delay.
