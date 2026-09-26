import * as z from 'zod'

const envSchema = z.object({
  WAVESHARE_GATEWAY_PATH: z.string(),
  EM111_REGISTER: z.string(),
  GATEWAY_WS_23626_001_IP: z.string(),
  ENV: z
    .union([
      z.literal('development'),
      z.literal('testing'),
      z.literal('production'),
    ])
    .default('development'),
})

export const env = envSchema.parse(process.env)
