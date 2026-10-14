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
  it('names the file when a config file is not valid JSON', () => {
    const root = 'tests/fixtures/broken-json'
    const gatewayDir = path.join(root, 'gateways')
    const profileDir = path.join(root, 'profiles')
    const brokenFile = path.join(gatewayDir, 'brokenGateway.json')
    expect(() => getValidatedConfigs(gatewayDir, profileDir)).toThrow(
      brokenFile,
    )
  })
  it('names the file when a config file does not match the schema', () => {
    const root = 'tests/fixtures/invalid-schema'
    const gatewayDir = path.join(root, 'gateways')
    const profileDir = path.join(root, 'profiles')
    const invalidFile = path.join(gatewayDir, 'invalidGateway.json')
    expect(() => getValidatedConfigs(gatewayDir, profileDir)).toThrow(
      invalidFile,
    )
  })
  it('throws an error when a config directory has no JSON files', () => {
    const root = 'tests/fixtures/no-json-files'
    const gatewayDir = path.join(root, 'gateways')
    const profileDir = path.join(root, 'profiles')
    expect(() => getValidatedConfigs(gatewayDir, profileDir)).toThrow(
      `Missing configs at: ${gatewayDir}`,
    )
  })
  it('returns the gateways and profiles when all config files are valid', () => {
    const root = 'tests/fixtures/valid'
    const gatewayDir = path.join(root, 'gateways')
    const profileDir = path.join(root, 'profiles')
    const { gateways, profiles } = getValidatedConfigs(gatewayDir, profileDir)
    expect(gateways.map((gateway) => gateway.name)).toEqual(['test-gateway'])
    expect(profiles.map((profile) => profile.name)).toEqual(['test-profile'])
  })
})
