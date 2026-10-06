import { env } from './config/env.js'
import path from 'node:path'
import { getValidatedConfigs } from './config/loadConfig.js'

const gatewayDir = path.join(env.CONFIG_DIR, 'gateways')
const profileDir = path.join(env.CONFIG_DIR, 'profiles')

const configs = getValidatedConfigs(gatewayDir, profileDir)
console.log(configs)
