import * as z from 'zod'

const profileRegisterSchema = z.object({
  id: z.string().min(1),
  unit: z.string(),
  adr: z.number().int().min(0).max(65535),
  count: z.number().int(),
  signed: z.boolean(),
  type: z.enum(['int16', 'int32']),
  scale: z.number(),
})

export const profileSchema = z.object({
  name: z.string().min(1),
  wordOrder: z.enum(['lowFirst', 'highFirst']),
  registers: z.array(profileRegisterSchema).min(1),
})

export type Profile = z.infer<typeof profileSchema>
