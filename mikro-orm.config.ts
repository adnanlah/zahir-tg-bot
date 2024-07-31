import { Options } from '@mikro-orm/core'
import { MongoDriver } from '@mikro-orm/mongodb'

import { ENV } from './src/utils/env'

const config = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  clientUrl: ENV.MONGODB_URL,
  dbName: ENV.DB_NAME,
  driver: MongoDriver,
  timezone: '+01:00',
  debug: true,
} as Options<MongoDriver>

export default config
