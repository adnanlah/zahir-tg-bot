import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations'
import { FileApiFlavor, FileFlavor, hydrateFiles } from '@grammyjs/files'
import { Api, Bot, Context, SessionFlavor, session } from 'grammy'

import { loginCommand } from './commands/login'
import { pointsCommand } from './commands/points'
import { startCommand } from './commands/start'
import { verifyByPhoneNumber } from './conversations/verifyByPhoneNumberConversation'
import { errorHandler } from './handlers/errorHandler'
import { photoHandler } from './handlers/photoHandler'
import { loginMenu } from './menus/loginMenu'
import { ENV } from './utils/env'

export type SessionData = {
  phoneNumber: string
  code: string
}

export type MyContext = FileFlavor<Context> & ConversationFlavor & SessionFlavor<SessionData>
export type MyConversation = Conversation<MyContext>
export type MyApi = FileApiFlavor<Api>

export const bot = new Bot<MyContext, MyApi>(ENV.BOT_TOKEN)

bot.use(
  session({
    initial() {
      return {
        phoneNumber: '',
        code: '',
      }
    },
  }),
)

// conversations
bot.use(conversations())

bot.use(createConversation(verifyByPhoneNumber))

// menus
bot.use(loginMenu)

// commands
bot.command('login', loginCommand)

bot.command('start', startCommand)

bot.command('points', pointsCommand)

// files upload
bot.api.config.use(hydrateFiles(bot.token))

bot.on([':photo'], photoHandler)

// error handling
bot.catch(errorHandler)

// drop pending updates
;(async function () {
  await bot.api.deleteWebhook({ drop_pending_updates: true })
})()
