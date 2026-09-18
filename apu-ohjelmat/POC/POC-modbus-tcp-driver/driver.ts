import modbus from 'modbus-serial'

const Modbus = modbus.default
const client = new Modbus()

const meterConfig = {
  ip: 'gateway-IP-address',
  options: {
    port: 502,
  },
}

// @param {number} dataAddress the Data Address of the first register.
// @param {number} length the total number of registers requested.

const readRequest = {
  dataAddress: 0,
  length: 29,
}

// data: Array<number>;
// buffer: Buffer;
await client.connectTCP(meterConfig.ip, meterConfig.options)

client.setID(1)

const response = await client.readHoldingRegisters(
  readRequest.dataAddress,
  readRequest.length,
)

client.close()
console.log(response.data)
