import * as z from 'zod'

const gatewaySlaveSchema = z.object({
  slaveId: z.number(),
  id: z.string(),
  profile: z.string(),
  label: z.string(),
})

export const gatewaySchema = z.object({
  name: z.string(),
  id: z.string(),
  ip: z.string(),
  port: z.number(),
  slaves: z.array(gatewaySlaveSchema),
})
