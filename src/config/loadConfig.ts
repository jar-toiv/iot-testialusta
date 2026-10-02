import { env } from '../config/env.js'
import { z, ZodObject } from 'zod'
import path from 'node:path'
import { readFile, readdir } from 'node:fs/promises'
import { gatewaySchema } from '../schemas/gateway/gatewaySchema.js'
import { profileSchema } from '../schemas/profile/profileSchema.js'

const gatewayDir = path.join(env.CONFIG_DIR, 'gateways')
const profileDir = path.join(env.CONFIG_DIR, 'profiles')
type RawConfigPair = { filePath: string; json: unknown }

const getConfigFilenames = async (dir: string) => {
  const dirFilenames = await readdir(dir)
  const configFilenames = dirFilenames.filter((name) => name.endsWith('.json'))

  if (configFilenames.length === 0) throw Error(`Missing configs at: ${dir}`)

  return configFilenames
}

const readRawConfigPairs = async (configFilenames: string[], dir: string) => {
  const rawConfigPairs: RawConfigPair[] = []

  for (const configFilename of configFilenames) {
    const filePath = path.join(dir, configFilename)
    const fileText = await readFile(filePath, { encoding: 'utf-8' })
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

// Gateway pipeline
const gatewayFilenames = await getConfigFilenames(gatewayDir)
const rawGatewayPairs = await readRawConfigPairs(gatewayFilenames, gatewayDir)
export const gateways = validateConfigPairs(rawGatewayPairs, gatewaySchema)

// Profile pipeline
const profileFilenames = await getConfigFilenames(profileDir)
const rawProfilePairs = await readRawConfigPairs(profileFilenames, profileDir)
export const profiles = validateConfigPairs(rawProfilePairs, profileSchema)
