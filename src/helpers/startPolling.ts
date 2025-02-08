import hubClient from '@/helpers/hubClient'
import env from '@/helpers/env'
import { Message } from '@farcaster/hub-nodejs'
import handleMention from '@/helpers/handleMention'

let polling = false
async function pollMentions(
) {
  if (polling) return
  polling = true
  try {
    console.log('Polling for mentions...')
    const mentions = [] as Message[]
    const { messages } = (await hubClient.getCastsByMention({
      fid: env.FID,
    }))._unsafeUnwrap()
    console.log('New mentions:', messages.length)
    mentions.push(...(messages || []))
    console.log('Polling done, handling mentions')
    for (const mention of mentions) {
      await handleMention(mention)
    }
    console.log('Done handling mentions')
  } catch (error) {
    console.error(error)
  } finally {
    polling = false
  }
}

export default function startPolling(
) {
  void pollMentions()
  setInterval(() => pollMentions(), 10 * 1000)
}
