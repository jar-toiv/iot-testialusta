# Raspberry Pi `vcgencmd get_throttled`

- **Kind:** Primary
- **URL:** https://www.raspberrypi.com/documentation/computers/os.html,
  section `get_throttled` under the `vcgencmd` utilities
- **Read:** 2026-10-15
- **Used by:** ADR-0001 Todennus

"Returns the throttled state of the system. This is a bit pattern. A bit
being set indicates the following meanings:"

| Bit | Hex | Meaning |
|---|---|---|
| 0 | 0x1 | "Undervoltage detected" |
| 1 | 0x2 | "Arm frequency capped" |
| 2 | 0x4 | "Currently throttled" |
| 3 | 0x8 | "Soft temperature limit active" |
| 16 | 0x10000 | "Undervoltage has occurred" |
| 17 | 0x20000 | "Arm frequency capping has occurred" |
| 18 | 0x40000 | "Throttling has occurred" |
| 19 | 0x80000 | "Soft temperature limit has occurred" |

## Not found

No source found for telling a watchdog reset apart from a normal reboot
(search 2026-10-15). ADR-0001 counts all unexpected reboots instead.
`journalctl --list-boots` needs a persistent journal, and the Raspberry Pi
OS default was not checked.
