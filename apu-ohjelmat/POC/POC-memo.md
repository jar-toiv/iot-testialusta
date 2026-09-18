# Memo of what I found or learned while doing testing of features

## Modbus-tcp-driver

### Learned

| Topic | Symptom | Reason | Solution | Evidence |
|---|---|---|---|---|
| CJS/ESM interop | error TS2351 | package is CJS and project is ESM. The default import binds to the module object, not the class in this case. | Read the class from the module object's default field before calling new | modbus-serial/index.js:1463 sets module.exports.default = module.exports; index.d.ts:10 declares export default ModbusRTU |

 - Top level await: an `await` in a module's body runs during module load, so
  every importer waits for it. An `await` inside an `async` function runs only
  when that function is called. The first shape belongs in an entry file only.
  A module others import should export an async function or a promise instead.


 ### Found

- Modbus-serial reads the first register with 0, mbpoll used 1
- This library also gives the raw bytes as a Buffer
- A register poll must be closed afterwards with close()
- connectTCP(ip, options, next) is the old callback form. Dropping next turns it into a Promise
- connectTCP handles both creating the port and opening it, so open() is not needed unless the port was given to the constructor
- setID() is set after the connection, i.e. after connectTCP(). It is the Modbus slave ID
- A 32-bit register is 2 * 16 bits, so length is 2. Which half is the high word comes from the device doc
- client.setTimeout(ms) and getTimeout() do exist. Needed for fault injection and for a half-open TCP connection, where the socket still looks alive, the peer is gone and no error ever arrives (ADR-0016)
