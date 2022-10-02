import { Notification } from '@/models/Notification'
import { ReminderModel } from '@/models/Reminder'
import { SeenNotificationIdModel } from '@/models/SeenNotificationId'
import { humanizer as humanizerBuilder } from 'humanize-duration'
import parse from 'parse-duration'
import publishCast from '@/helpers/publishCast'

const humanizer = humanizerBuilder()

async function handleNotification(notification: Notification) {
  if (
    !notification.cast?.text ||
    !notification.cast?.merkleRoot ||
    !notification.user?.username
  ) {
    return
  }
  try {
    const duration = parse(notification.cast.text)
    if (!duration) {
      return
    }
    const humanizedDuration = humanizer(duration)
    await ReminderModel.create({
      fireTime: (notification.cast.publishedAt + duration) / 1000,
      replyToCastId: notification.cast.merkleRoot,
      username: notification.user.username,
    })
    const replyText = `Noted 📝 I will remind you in ${humanizedDuration}`
    await publishCast(replyText, notification.cast.merkleRoot)
  } catch (error) {
    console.error(
      'Error replying to a mention',
      error instanceof Error ? error.message : error
    )
    try {
      await publishCast(
        `@borodutch I'm not sure what to do with this 😱`,
        notification.cast.merkleRoot
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
