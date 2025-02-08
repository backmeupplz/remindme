import { ReminderModel } from '@/models/Reminder'
import { SeenNotificationIdModel } from '@/models/SeenNotificationId'
import humanizer from '@/helpers/humanizer'
import parse from 'parse-duration'
import publishCast from '@/helpers/publishCast'
import { Message } from '@farcaster/hub-nodejs'
import { uint8ArrayToHex } from '@/helpers/bufferUtils'
import farcasterEpochToUnix from './farcasterEpochToUnix'

function dateFromUnixTimestamp(timestamp: number) {
  const date = new Date()
  date.setTime(timestamp)
  return date
}

async function handleMention(mention: Message) {
  if (
    !mention.data?.castAddBody?.text ||
    !mention.data?.fid ||
    !mention.hash
  ) {
    console.log('Cannot process mention', JSON.stringify(mention, undefined, 2))
    return
  }
  try {
    const duration = parse(mention.data.castAddBody.text)
    if (!duration) {
      return
    }
    const humanizedDuration = humanizer(duration)
    await ReminderModel.create({
      fireTime:
        (farcasterEpochToUnix(mention.data.timestamp) + duration) / 1000,
      replyToCastId: uint8ArrayToHex(mention.hash),
      duration,
      replyToCastAuthorFid: mention.data.fid,
    })
    const replyText = `📝 Noted! I will remind you about this cast in ${humanizedDuration} 🫡 Don't forget to follow @remindme to get notified!`
    await publishCast({
      text: replyText,
      parentCastId: {
        fid: mention.data.fid,
        hash: mention.hash,
      }
    })
    console.log(`Added reminder for (${dateFromUnixTimestamp(farcasterEpochToUnix(mention.data.timestamp) + duration)}): "${mention.data.castAddBody.text}", owner: ${mention.data.fid}`)
  } catch (error) {
    console.error(
      'Error replying to a mention', mention.data.castAddBody.text,
      error instanceof Error ? error.message : error
    )
    try {
      await publishCast({
        text: `I'm not sure what to do with this 😱 Tag @warpcastadmin.eth, maybe?`,
        parentCastId: {
          fid: mention.data.fid,
          hash: mention.hash,
        }
      })
    } catch (error) {
      console.error(
        'Error sending error on Farcaster',
        error instanceof Error ? error.message : error
      )
    }
  }
}

export default async function (mention: Message) {
  const seenNotificationId = await SeenNotificationIdModel.findOne({
    notificationId: uint8ArrayToHex(mention.hash),
  })
  if (seenNotificationId) return
  await SeenNotificationIdModel.create({
    notificationId: uint8ArrayToHex(mention.hash),
  })
  if (
    farcasterEpochToUnix(mention.data?.timestamp || 0) <
    (Date.now() - 1000 * 60 * 60 * 24)
  ) {
    return
  }
  console.log('Handling mention', `"${mention.data?.castAddBody?.text}"`)
  void handleMention(mention)
}
