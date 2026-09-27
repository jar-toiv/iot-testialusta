import * as z from 'zod'

const envSchema = z.object({
  CONFIG_DIR: z.string().min(1),
  ENV: z
    .union([
      z.literal('development'),
      z.literal('testing'),
      z.literal('production'),
    ])
    .default('development'),
})

export const env = envSchema.parse(process.env)
