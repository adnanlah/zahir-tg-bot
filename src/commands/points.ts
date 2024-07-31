import { MyContext } from '../bot'
import { checkPointsRemaining } from '../services/apiService'

export const pointsCommand = async (ctx: MyContext) => {
  try {
    const points = await checkPointsRemaining({
      telegramId: (await ctx.getAuthor()).user.id,
    })

    if ('error' in points) {
      await ctx.reply(`Error: ` + points.error.message)
      return
    }

    await ctx.reply(`النقاط المتبقية: ${points.result.data.pointsRemaining}`)
  } catch (err: any) {
    await ctx.reply(`Error: `)
    throw err
  }
}
