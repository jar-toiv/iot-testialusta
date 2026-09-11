# Part 2 Sending poll to slave and pushing it to the object

### Notes
* Variables
* Apply Async / Await for poll promise
* Use regex to find [0x] . . .
* Push the successful RX into registers object

`mbpoll 192.168.50.46 -a 1 -r 1 -c 2 -p 502 -t 4 -x -1` Windows
`mbpoll 192.168.50.46 -a 1 -r 1 -c 2 -p 502 -t 4 -1` Linux

>### What I learned / studied
>* Re-learn how to promisify a function simply.
>* Learn about child_process and how to apply it to `'PATH'`. No error handling yet
>* How to make slightly complex regex for this device RX.

```
const registerVoltage = {
  status: 'pending',
  variable: 'V L-N',
  physicalAddress: '0x0000',
  pollAddress: '1',
  dataFormat: 'int32',
  weight: '10',
  success: {
    rawDec: [],
    value: Number(),
  },
  error: {
    raw: '',
  },
}
```
# PSEUDO

```
IMPORT PROMISIFY node:util
IMPORT CHILD_PROCESS node:child_process

CONST Pollstring
CONST OBJ registerVoltage 

PROMISIFY EXECFILE

ASYNC FUNCTION POLL () 
    CONST {STDOUT, STDERR} AWAIT EXECFILEPROMISE ('MBPOLL', Pollstring)

REGEX FOR STRIPPING THE RX
LET MATCHES MATCHALL(STDOUT)

FOR OF MATCHES
    OBJECT.ENTRIES PUSH MATCH

HANDLEINT32(registerVoltage)

CONST FUNCTION HANDLEINT32(registerVoltage)
    LOG DATA

POLLDATA()
```
