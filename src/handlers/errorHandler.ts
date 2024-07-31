import { BotError, GrammyError, HttpError } from 'grammy'

import { MyContext } from '../bot'
import { orm } from '../config/db'
import { Log } from '../entities/Log'

export const errorHandler = async (err: BotError<MyContext>) => {
  const ctx = err.ctx
  console.error(`=== bot error ===`)
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const em = orm.em.fork()
  const e = err.error
  if (e instanceof GrammyError) {
    await em.persistAndFlush(
      em.create(Log, {
        description: 'Error in request: ' + e.description,
        type: 'Error',
      }),
    )
  } else if (e instanceof HttpError) {
    await em.persistAndFlush(
      em.create(Log, {
        description: 'Could not contact Telegram: ' + e,
        type: 'Error',
      }),
    )
  } else {
    await em.persistAndFlush(
      em.create(Log, {
        description: 'Unknown error:' + e,
        type: 'Error',
      }),
    )
  }
}
