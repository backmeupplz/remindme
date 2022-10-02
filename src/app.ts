import 'module-alias/register'
import 'source-map-support/register'

import runMongo from '@/helpers/mongo'
import startPolling from '@/helpers/startPolling'

void (async () => {
  console.log('Starting mongo...')
  await runMongo()
  console.log('Starting polling...')
  startPolling()
  console.log('App started!')
})()
