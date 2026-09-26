import { env } from '../config/env.js'
import { readFile } from 'node:fs/promises'
import { gatewaySchema } from '../schemas/gatewaySchema.js'
import { profileSchema } from '../schemas/profileSchema.js'

const gatewayConfigPath = env.WAVESHARE_GATEWAY_PATH
const profilePatch = env.EM111_REGISTER

const gatewayConfigText = await readFile(gatewayConfigPath, {
  encoding: 'utf-8',
})
const profileText = await readFile(profilePatch, { encoding: 'utf-8' })

const gatewayConfig: unknown = JSON.parse(gatewayConfigText)
const profile: unknown = JSON.parse(profileText)

export const validatedGateway = gatewaySchema.parse(gatewayConfig)
export const validatedProfile = profileSchema.parse(profile)
