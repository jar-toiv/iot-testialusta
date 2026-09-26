import * as z from 'zod'

const profileRegisterSchema = z.object({
  id: z.string(),
  unit: z.string(),
  adr: z.number(),
  count: z.number(),
  signed: z.boolean(),
  scale: z.number(),
})

export const profileSchema = z.object({
  name: z.string(),
  wordOrder: z.string(),
  registers: z.array(profileRegisterSchema),
})
