import 'module-alias/register'
import 'source-map-support/register'

import runMongo from '@/helpers/mongo'
import startPolling from '@/helpers/startPolling'
import startReminding from '@/helpers/startReminding'

void (async () => {
  console.log('Starting mongo...')
  await runMongo()
  console.log('Starting polling...')
  await startPolling()
  console.log('Starting reminders...')
  startReminding()
  console.log('App started!')
})()
