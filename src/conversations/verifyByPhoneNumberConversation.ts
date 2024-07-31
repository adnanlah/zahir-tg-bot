import { MyContext, MyConversation } from '../bot'
import { checkIfVerified, checkVerificationCode, verifyPhoneNumber } from '../services/apiService'

export async function verifyByPhoneNumber(conversation: MyConversation, ctx: MyContext) {
  try {
    const telegramId = (await ctx.getAuthor()).user.id

    do {
      await ctx.reply('ما هو رقم هاتفك؟')
      ctx = await conversation.wait()

      if (ctx.message?.text === '/cancel') {
        await ctx.reply('تم الإلغاء!')
        return
      }

      if (ctx.message?.text?.length !== 10) {
        await ctx.reply('رقم الهاتف غير صالح! أعد كتابته مرة أخرى، أو `/cancel` للمغادرة!')
        continue
      } else {
        ctx.session.phoneNumber = ctx.message?.text
      }
    } while (ctx.message?.text?.length !== 10)

    const { phoneNumber } = ctx.session

    await ctx.reply(`انتظر، حتى نتحقق من رقم هاتفك (+213${phoneNumber})..`)

    try {
      const res = await conversation.external(async () => {
        return await checkIfVerified({
          telegramId: Number(telegramId),
          phoneNumber,
        })
      })

      if ('error' in res) {
        await ctx.reply(`Error in checkIfVerified: ` + res.error.message)
        return
      }

      if (res?.result.data.status === 'verified') {
        await ctx.reply('حساب التلغرام الخاص بك مرتبط بالفعل بخدماتنا.')
        return
      }
    } catch (err: any) {
      await ctx.reply(`مشكلة في الاتصال بالخادم، يرجى المحاولة مرة أخرى لاحقاً!` + err.message)
      return
    }

    try {
      const verifyResponse = await conversation.external(async () => {
        return await verifyPhoneNumber({
          telegramId,
          phoneNumber,
        })
      })

      if ('error' in verifyResponse) {
        await ctx.reply(
          `مشكلة في التحقق من رقم الهاتف، يرجى المحاولة مرة أخرى لاحقاً! ${verifyResponse.error.message}`,
        )
        return
      }
    } catch (err: any) {
      await ctx.reply(
        `مشكلة في التحقق من رقم الهاتف، يرجى المحاولة مرة أخرى لاحقاً!: `,
        err.message,
      )
      return
    }

    do {
      await ctx.reply('تحقق مما إذا كنت قد تلقيت الرمز في رقم هاتفك')
      ctx = await conversation.wait()

      if (ctx.message?.text === '/cancel') {
        await ctx.reply('تم الإلغاء!')
        return
      }

      if (ctx.message?.text?.length !== 4) {
        await ctx.reply('رمز غير صالح! أعد كتابته مرة أخرى، أو `/cancel` للمغادرة!')
        continue
      } else {
        ctx.session.code = ctx.message?.text
      }
    } while (ctx.message?.text?.length !== 4)

    try {
      const checkCodeResponse = await conversation.external(async () => {
        return await checkVerificationCode({
          telegramId,
          phoneNumber,
          code: ctx.session.code,
        })
      })

      if ('error' in checkCodeResponse) {
        await ctx.reply(
          `مشكلة في التحقق من رقم الهاتف، يرجى المحاولة مرة أخرى لاحقاً! ${checkCodeResponse.error.message}`,
        )
        return
      }

      const {
        result: {
          data: { status },
        },
      } = checkCodeResponse

      if (status === 'approved') {
        await ctx.reply('تم التحقق بنجاح!')
        return
      } else {
        await ctx.reply(`فشل في التحقق! ${status}`)
      }
    } catch (err: any) {
      await ctx.reply(`مشكلة في الاتصال بالخادم، يرجى المحاولة مرة أخرى لاحقاً!`)
      return
    }

    return
  } catch (err: any) {
    console.log(`Error in verifyByPhoneNumber conversation: `, err.message)
    throw err // it will be caught by the error handler
  }
}
