import { S3 } from 'aws-sdk'

import { ENV } from '../utils/env'

export const s3 = new S3({
  endpoint: ENV.CLOUDFLARE_ENDPOINT,
  accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
})
