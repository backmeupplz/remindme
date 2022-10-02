import 'module-alias/register'
import 'source-map-support/register'

import runMongo from '@/helpers/mongo'

void (async () => {
  console.log('Starting mongo')
  await runMongo()
  console.log('Mongo connected')
})()
