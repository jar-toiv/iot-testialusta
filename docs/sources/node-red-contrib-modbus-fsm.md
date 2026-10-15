# node-red-contrib-modbus client state machine

- **Kind:** Primary (source code)
- **Repo:** https://github.com/BiancoRoyal/node-red-contrib-modbus, file
  `src/core/modbus-client-core.js`, read on `master`. Repo HEAD at time of
  writing: `84f1ab20dccb9409146cedc62a04ccf6a9c729f6` (HEAD may be a
  different branch than `master`, not checked)
- **Read:** 2026-10-15, via WebFetch
- **Used by:** MTD design.md, connection life diagram

Library: `@xstate/fsm` (`require('@xstate/fsm')`, `createMachine`,
`interpret`). `id: 'modbus'`, `initial: 'new'`.

16 states. Transitions as restructured by WebFetch (not verbatim):

| State | Event -> target |
|---|---|
| new | INIT -> init, BREAK -> broken, STOP -> stopped |
| broken | INIT -> init, STOP -> stopped, FAILURE -> failed, RECONNECT -> reconnecting |
| reconnecting | INIT -> init, STOP -> stopped |
| init | OPENSERIAL -> opened, CONNECT -> connected, BREAK -> broken, FAILURE -> failed, STOP -> stopped, SWITCH -> switch |
| opened | CONNECT -> connected, BREAK, FAILURE, CLOSE -> closed, STOP, SWITCH |
| connected | CLOSE, ACTIVATE -> activated, QUEUE -> queueing, BREAK, FAILURE, STOP, SWITCH |
| activated | READ -> reading, WRITE -> writing, QUEUE, BREAK, CLOSE, FAILURE, STOP, SWITCH |
| queueing | ACTIVATE, SEND -> sending, READ, WRITE, EMPTY -> empty, BREAK, CLOSE, FAILURE, STOP, SWITCH |
| empty | QUEUE, BREAK, FAILURE, CLOSE, STOP, SWITCH |
| sending | ACTIVATE, READ, WRITE, BREAK, FAILURE, STOP, SWITCH |
| reading | ACTIVATE, BREAK, FAILURE, STOP |
| writing | ACTIVATE, BREAK, FAILURE, STOP |
| closed | FAILURE, BREAK, CONNECT, RECONNECT, INIT, STOP, SWITCH |
| failed | CLOSE, BREAK, STOP, SWITCH |
| switch | CLOSE, BREAK, STOP |
| stopped | NEW -> new, STOP -> stopped |

`broken` (temporary loss) and `failed` (persistent fault) are separate
states. The machine is per client (connection), not per unit id.
