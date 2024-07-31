import { MyContext } from '../bot'
import { loginMenu } from '../menus/loginMenu'

export const loginCommand = async (ctx: MyContext) => {
  const telegramId = (await ctx.getAuthor()).user.id
  await ctx.reply(`Check out this menu':`, {
    reply_markup: loginMenu,
  })
}
