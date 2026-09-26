import modbuslib from 'modbus-serial'
import { readFile } from 'node:fs/promises'

const Modbus = modbuslib.default
const client = new Modbus()

const gatewayConfigPath = process.env.WAVESHARE_GATEWAY_PATH
const GATEWAY_IP = process.env.GATEWAY_WS_23626_001_IP
const profilePatch = process.env.EM111_REGISTER

if (!gatewayConfigPath || !GATEWAY_IP || !profilePatch) {
  throw Error(`Missing env.var ${gatewayConfigPath}`)
}

const gatewayConfigText = await readFile(gatewayConfigPath, {
  encoding: 'utf8',
})
const profileText = await readFile(profilePatch, { encoding: 'utf8' })

const gatewayConfig = JSON.parse(gatewayConfigText)
const profile = JSON.parse(profileText)

const meter = {
  slaveId: gatewayConfig.slaves[0].slaveId,
  adr: profile.registers[0].adr,
  count: profile.registers[0].count,
}
await client.connectTCP(GATEWAY_IP, gatewayConfig.port)

client.setID(meter.slaveId)

const { data, buffer } = await client.readHoldingRegisters(
  meter.adr,
  meter.count,
)

client.close()

console.log(data)
console.log(buffer)
