import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  BOT_TOKEN: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_ENDPOINT: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  ZAHIR_INSIGHT_URL: z.string(),
  ZAHIR_ACCESS_KEY_ID: z.string(),
  ZAHIR_SECRET_ACCESS_KEY: z.string(),
  MONGODB_URL: z.string(),
  DB_NAME: z.string(),
})

export const ENV = envSchema.parse(process.env)
