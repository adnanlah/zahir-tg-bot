import { bot } from './bot'
import { initORM } from './config/db'

initORM()
bot.start()
