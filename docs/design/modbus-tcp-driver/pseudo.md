## Modbus-tcp-driver-pseudo

- This file is not maintained actively 
- Warning this file can contain old, redundant or wrong code
- Official doc: `EM111_EM112_ET112_CP.pdf`, `iot-testialusta\hardware\carlo-gavazzi-em111\`
- DATA and BUFFER both been tested. 
- Register readings GROUPS 000h-001Bh, 0020h-0023h `hardware/carlo-gavazzi-em111/configuration.md`

### IMPORTS

```
IMPORT modbuslib FROM 'modbus-serial'


CONST Modbus = modbuslib.default
CONST client = new Modbus()
```

### DATA MODEL

```
OBJECT holdingRegisters
    address:
    type:
    variable:
    weight:
```

### CONNECTION MODEL

```
OBJECT gatewayConfig
    ip: string,
        options: {
            port: number;
            localAddress?: string;
            timeout: number;
            socket?: Socket;
            socketOpts?: SocketConstructorOpts;
        }

OBJECT meterConfig
    slaveID: number
    responseTimeoutMs: number 
```

### CONNECTION

```
AWAIT connectTCP(ip, options, delete NEXT so PROMISE triggers)
client.setID(meterConfig.slaveID)
client.setTimeout(meterConfig.responseTimeoutMs)
```

### READING REGISTERS 

```
CONST RESPONSE {data, buffer} = AWAIT readHoldingRegisters(dataAddress: number, length: number)

LOG data, buffer
```

### RESULT/RESPONSE DATA

### RESULT/RESPONSE BUFFER

### ERRORS

### EXPORTS
