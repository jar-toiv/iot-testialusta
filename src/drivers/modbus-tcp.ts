import modbuslib from 'modbus-serial'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const Modbus = modbuslib.default
const client = new Modbus()

const gatewayConfigPath = process.env.WAVESHARE_GATEWAY_PATH
if (!gatewayConfigPath) {
  throw Error(`Missing env.var ${gatewayConfigPath}`)
}

const json = await readFile(gatewayConfigPath, {
  encoding: 'utf8',
})
// console.log(resolve(gatewayConfigPath))
// console.log(typeof gatewayConfigPath) //STRING

// console.log(json)
// // console.log(typeof json)
console.log(json)

/**
try {s
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
 */

const meterConfig = {
  id: 1,
  responseTimeoutMs: 500,
}

// await client.connectTCP(gatewayConfig.ip, gatewayConfig.options)
// client.setID(meterConfig.id)

// const { data, buffer } = await client.readHoldingRegisters(
//   holdingRegisters.address,
//   holdingRegisters.length,
// )

// client.close()

// console.log(data)
// console.log(buffer)
