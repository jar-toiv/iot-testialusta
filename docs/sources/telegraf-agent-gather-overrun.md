# Telegraf agent: gather longer than the interval

- **Kind:** Primary (source code)
- **Repo:** https://github.com/influxdata/telegraf, file `agent/agent.go`,
  read on `master`. HEAD not recorded.
- **Read:** 2026-10-19, via WebFetch
- **Used by:** MTD design.md, Error handling item 4 (cycle overrun)

## `agent/agent.go`, `gatherOnce`

```go
slowWarning := time.NewTicker(interval)
defer slowWarning.Stop()
```

```go
case <-slowWarning.C:
    log.Printf("W! [%s] Collection took longer than expected; not complete after interval of %s",
        input.LogName(), interval)
    input.IncrGatherTimeouts()
case <-ticker.C:
    log.Printf("D! [%s] Previous collection has not completed; scheduled collection skipped",
        input.LogName())
```

`gatherLoop` calls it on each tick:

```go
case <-ticker.C:
    err := a.gatherOnce(acc, input, ticker, interval)
```

Behaviour as read: one gather per input at a time. A tick that fires during
a slow gather is logged and dropped, and the next gather waits for the next
scheduled tick. Missed ticks are not made up. The overrun is counted
(`IncrGatherTimeouts`).
