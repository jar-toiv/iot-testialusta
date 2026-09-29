import * as z from 'zod'

const gatewaySlaveSchema = z.object({
  slaveId: z.number().int().min(1).max(247),
  id: z.string().min(1),
  profile: z.string().min(1),
  label: z.string().min(1),
})

export const gatewaySchema = z.object({
  name: z.string().min(1),
  id: z.string().min(1),
  ip: z.ipv4(),
  port: z.number().int().min(1).max(65535),
  slaves: z.array(gatewaySlaveSchema),
})

export type Gateway = z.infer<typeof gatewaySchema>
