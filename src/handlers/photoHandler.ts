import { readFileSync } from 'fs'

import { MyContext } from '../bot'
import { addImages, checkIfTgBound } from '../services/apiService'
import { s3 } from '../services/s3Service'
import { ENV } from '../utils/env'
import { calculateSHA256 } from '../utils/helpers'
import { nano } from '../utils/lib'

export const photoHandler = async (ctx: MyContext) => {
  try {
    const telegramId = (await ctx.getAuthor()).user.id

    try {
      const isBound = await checkIfTgBound({
        telegramId,
      })

      if ('error' in isBound) {
        ctx.reply('Error checking if your Telegram account is bound!')
        return
      }

      if (isBound.result.data.status === 'not_bound') {
        ctx.reply('Your Telegram account is not bound to your Zahir account!')
        return
      }
    } catch (err: any) {
      console.log(`Networkd eror in checkIfTgBound: `, err.message)
      return
    }

    const file = await ctx.getFile()
    const path = await file.download()
    const blob = readFileSync(path)

    ctx.reply('Uploading...')

    const uploadedImage = await s3
      .upload({
        Bucket: ENV.CLOUDFLARE_BUCKET_NAME,
        Key: nano() + '.png',
        Body: blob,
      })
      .promise()

    ctx.reply('Uploaded!')
    ctx.reply('Adding images to your account...')

    try {
      const res = await addImages({
        images: [
          {
            filename: uploadedImage.Key,
            sha256: calculateSHA256(blob),
          },
        ],
        telegramId,
      })

      if (!res) {
        ctx.reply('Error trying to add images to your account!')
        return
      }

      if ('error' in res) {
        console.log(`Error in addImages: `, res.error.message)
        return
      }
    } catch (err: any) {
      console.log(`Networkd eror in addImages: `, err.message)
      return
    }

    ctx.reply('Done!')
  } catch (error: any) {
    console.log(`global error: `, error.message)
  }
}
