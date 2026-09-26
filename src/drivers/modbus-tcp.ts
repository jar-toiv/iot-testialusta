import { env } from '../config/env.js'
import modbuslib from 'modbus-serial'
import { validatedGateway, validatedProfile } from '../config/loadConfig.js'

const Modbus = modbuslib.default
const client = new Modbus()

const gatewayIp = env.GATEWAY_WS_23626_001_IP
const gateway = validatedGateway
const meter = validatedProfile

await client.connectTCP(gatewayIp, { port: gateway.port })
client.setID(gateway.slaves[0].slaveId)

const { data, buffer } = await client.readHoldingRegisters(
  meter.registers[0].adr,
  meter.registers[0].count,
)

client.close()

console.log(data)
console.log(buffer)
