import { CastWithInteractions } from '../../node_modules/@standard-crypto/farcaster-js-neynar/dist/commonjs/v1/openapi/generated/models/cast-with-interactions'
import { ReminderModel } from '../models/Reminder'
import { SeenNotificationIdModel } from '../models/SeenNotificationId'
import humanizer from './humanizer'
import parse from 'parse-duration'
import publishCast from './publishCast'

async function handleNotification(notification: CastWithInteractions) {
  if (
    !notification.text ||
    !notification.hash ||
    !('username' in notification.author)
  ) {
    console.log('Cannot process notification', notification)
    return
  }
  try {
    const duration = parse(notification.text)
    if (!duration) {
      return
    }
    const humanizedDuration = humanizer(duration)
    await ReminderModel.create({
      fireTime: (+notification.timestamp + duration) / 1000,
      replyToCastId: notification.hash,
      username: notification.author.username,
      duration,
    })
    console.log(
      'Adding reminder',
      notification.author.username,
      humanizedDuration,
      duration,
      (+notification.timestamp + duration) / 1000,
      notification.hash
    )
    const replyText = `📝 Noted! I will remind you about this cast in ${humanizedDuration} 🫡`
    await publishCast(replyText, notification.hash)
  } catch (error) {
    console.error(
      'Error replying to a mention',
      error instanceof Error ? error.message : error
    )
    try {
      await publishCast(
        `@borodutch I'm not sure what to do with this 😱`,
        notification.hash
      )
    } catch (error) {
      console.error(
        'Error sending error on Farcaster',
        error instanceof Error ? error.message : error
      )
    }
  }
}

export default async function (notification: CastWithInteractions) {
  if (notification.type !== 'cast-mention') return
  const seenNotificationId = await SeenNotificationIdModel.findOne({
    notificationId: notification.hash,
  })
  if (seenNotificationId) return
  await SeenNotificationIdModel.create({
    notificationId: notification.hash,
  })
  if ((+notification.timestamp || 0) < Date.now() - 1000 * 60 * 60 * 24) {
    return
  }
  void handleNotification(notification)
}
