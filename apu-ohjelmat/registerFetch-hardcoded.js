/* eslint-disable */
import { promisify } from 'node:util'
import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import { stderr } from 'node:process'

const pollString = [
  '192.168.50.46',
  '-a',
  '1',
  '-r',
  '1',
  '-c',
  '2',
  '-p',
  '502',
  '-t',
  '4',
  '-x',
  '-1',
]

const registerVoltage = {
  status: 'pending',
  variable: 'V L-N',
  physicalAddress: '0x0000',
  pollAddress: '1',
  type: 'int32',
  weight: 10,
  success: {
    rawDec: [],
    value: 0,
  },
  error: {
    raw: '',
  },
}

const execFilePromise = promisify(execFile)

const pollData = async () => {
  try {
    const { stdout, stderr } = await execFilePromise('mbpoll', pollString)

    if (stderr) throw new Error(`from STDERR: ${stderr}`)
    const regexp = /\[0x(\w+)\]:\s*(-?\d+)/g
    let matches = [...stdout.matchAll(regexp)]
    for (const match of matches) {
      registerVoltage.success.rawDec.push(match[2])
    }
    decodeInt32(registerVoltage)
  } catch (err) {
    console.log('Error polling the meter', err)
  }
}

const decodeInt32 = (register) => {
  const [firstInt16, secondInt16] = register.success.rawDec.map(Number)
  const value = firstInt16 + secondInt16 * 65536
  const valueDec = value >= 2147483648 ? value - 4294967296 : value
  const voltage = valueDec / register.weight

  register.success.value = voltage
  console.log(register)
  saveAsJSON(register)
}

const saveAsJSON = async (register) => {
  const json = JSON.stringify(register, null, 2)

  try {
    await fs.writeFile('apu-ohjelmat/voltageRegisterJson.json', json)

    console.log('The file has been saved!')
  } catch (err) {
    console.error('Writing a file failed.', err)
  }
}

pollData()
