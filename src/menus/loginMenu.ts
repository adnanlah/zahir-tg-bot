import { Menu } from '@grammyjs/menu'

import { MyContext } from '../bot'

export const loginMenu = new Menu<MyContext>('my-menu-identifier')
  .text('E-Mail', (ctx) => {
    ctx.reply('You pressed A!')
  })
  .row()
  .text('Phone number', async (ctx) => await ctx.conversation.enter('verifyByPhoneNumber'))
