import { Notification } from '@big-whale-labs/botcaster'
import { ReminderModel } from '../models/Reminder'
import { SeenNotificationIdModel } from '../models/SeenNotificationId'
import humanizer from './humanizer'
import parse from 'parse-duration'
import publishCast from './publishCast'

async function handleNotification(notification: Notification) {
  if (
    !notification.content.cast?.text ||
    !notification.content.cast?.hash ||
    !notification.actor?.username
  ) {
    console.log('Cannot process notification', notification)
    return
  }
  try {
    const duration = parse(notification.content.cast.text)
    if (!duration) {
      return
    }
    const humanizedDuration = humanizer(duration)
    await ReminderModel.create({
      fireTime: (notification.content.cast.timestamp + duration) / 1000,
      replyToCastId: notification.content.cast.hash,
      username: notification.actor.username,
      duration,
    })
    console.log(
      'Adding reminder',
      notification.actor.username,
      humanizedDuration,
      duration,
      (notification.content.cast.timestamp + duration) / 1000,
      notification.content.cast.hash
    )
    const replyText = `📝 Noted! I will remind you about this cast in ${humanizedDuration} 🫡`
    await publishCast(replyText, notification.content.cast.hash)
  } catch (error) {
    console.error(
      'Error replying to a mention',
      error instanceof Error ? error.message : error
    )
    try {
      await publishCast(
        `@borodutch I'm not sure what to do with this 😱`,
        notification.content.cast.hash
      )
    } catch (error) {
      console.error(
        'Error sending error on Farcaster',
        error instanceof Error ? error.message : error
      )
    }
  }
}

export default async function (notification: Notification) {
  if (notification.type !== 'cast-mention') return
  const seenNotificationId = await SeenNotificationIdModel.findOne({
    notificationId: notification.id,
  })
  if (seenNotificationId) return
  void handleNotification(notification)
  await SeenNotificationIdModel.create({
    notificationId: notification.id,
  })
}
