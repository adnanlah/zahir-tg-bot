import { MyContext } from '../bot'
import { Menu } from '@grammyjs/menu'

export const loginMenu = new Menu<MyContext>('my-menu-identifier')
  .text('E-Mail', (ctx) => {
    ctx.reply('You pressed A!')
  })
  .row()
  .text('Phone number', async (ctx) => await ctx.conversation.enter('verifyByPhoneNumber'))
