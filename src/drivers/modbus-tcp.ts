import modbuslib from 'modbus-serial'

const Modbus = modbuslib.default
const client = new Modbus()

// add ZOD, import register JSON later

const holdingRegisters = {
  address: 0,
  type: 'int32',
  variable: 'V',
  weight: 10,
  length: 29,
}

const gatewayConfig = {
  ip: 'XXXXX',
  options: {
    port: 502,
    // // // // localAddress?: string,
    // // // timeout: number,
    // // socket?: Socket;
    //     socketOpts?: SocketConstructorOpts;
  },
}

const meterConfig = {
  id: 1,
  responseTimeoutMs: 500,
}

await client.connectTcpRTUBuffered(gatewayConfig.ip, gatewayConfig.options)
client.setID(meterConfig.id)

const { data, buffer } = await client.readHoldingRegisters(
  holdingRegisters.address,
  holdingRegisters.length,
)

client.close()

console.log(data)
console.log(buffer)
