import { describe, it, expect } from 'vitest'
import { getValidatedConfigs } from '../../src/config/loadConfig.js'
import path from 'node:path'

describe('getValidatedConfigs', () => {
  it('throws an error when config/gateways directory does not exist', () => {
    const root = 'tests/fixtures/no-gateways'
    const gatewayDir = path.join(root, 'gateways')
    const profileDir = path.join(root, 'profiles')
    expect(() => getValidatedConfigs(gatewayDir, profileDir)).toThrow(
      gatewayDir,
    )
  })
  it('throws an error when config/profiles directory does not exist', () => {
    const root = 'tests/fixtures/no-profiles'
    const gatewayDir = path.join(root, 'gateways')
    const profileDir = path.join(root, 'profiles')
    expect(() => getValidatedConfigs(gatewayDir, profileDir)).toThrow(
      profileDir,
    )
  })
})
