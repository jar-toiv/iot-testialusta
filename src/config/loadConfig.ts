import { z, ZodObject } from 'zod'
import path from 'node:path'
import { readFileSync, readdirSync } from 'node:fs'
import { gatewaySchema } from '../schemas/gateway/gatewaySchema.js'
import { profileSchema } from '../schemas/profile/profileSchema.js'

type RawConfigPair = { filePath: string; json: unknown }

const getConfigFilenames = (dir: string) => {
  let dirFilenames: string[]
  try {
    dirFilenames = readdirSync(dir)
  } catch (err) {
    throw new Error(`Cannot read config directory: ${dir}`, { cause: err })
  }
  const configFilenames = dirFilenames.filter((name) => name.endsWith('.json'))

  if (configFilenames.length === 0) throw Error(`Missing configs at: ${dir}`)

  return configFilenames
}

const readRawConfigPairs = (configFilenames: string[], dir: string) => {
  const rawConfigPairs: RawConfigPair[] = []

  for (const configFilename of configFilenames) {
    const filePath = path.join(dir, configFilename)
    const fileText = readFileSync(filePath, { encoding: 'utf-8' })
    const json: unknown = JSON.parse(fileText)
    rawConfigPairs.push({ filePath, json })
  }
  return rawConfigPairs
}

export const validateConfigPairs = <T extends ZodObject>(
  rawConfigPairs: RawConfigPair[],
  schema: T,
) => {
  const validConfigs: z.core.output<T>[] = []

  for (const rawConfigPair of rawConfigPairs) {
    try {
      const validConfig = schema.parse(rawConfigPair.json)
      validConfigs.push(validConfig)
    } catch (err) {
      throw new Error(`Parsing failed at ${rawConfigPair.filePath}`, {
        cause: err,
      })
    }
  }
  return validConfigs
}

export const getValidatedConfigs = (gatewayDir: string, profileDir: string) => {
  // Gateway pipeline
  const gatewayFilenames = getConfigFilenames(gatewayDir)
  const rawGatewayPairs = readRawConfigPairs(gatewayFilenames, gatewayDir)
  const gateways = validateConfigPairs(rawGatewayPairs, gatewaySchema)

  // Profile pipeline
  const profileFilenames = getConfigFilenames(profileDir)
  const rawProfilePairs = readRawConfigPairs(profileFilenames, profileDir)
  const profiles = validateConfigPairs(rawProfilePairs, profileSchema)

  return { gateways, profiles }
}
