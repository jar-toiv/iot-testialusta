// Placeholder test.
//
// Exists so `npm test` is verifiable end to end. Replace with real driver
// and pipeline tests as they are written.

import { describe, it, expect } from 'vitest'
import { SCAFFOLD_READY } from '../src/index.js'

describe('scaffold', () => {
  it('is wired up', () => {
    expect(SCAFFOLD_READY).toBe(true)
  })
})
