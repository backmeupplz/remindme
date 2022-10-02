import { CurrentNotificationIdModel } from '@/models/CurrentNotificationId'

export async function getCurrentNotificationId() {
  return (await CurrentNotificationIdModel.findOne())?.notificationId
}

export async function setCurrentNotificationId(notificationId: string) {
  await CurrentNotificationIdModel.deleteMany({})
  return CurrentNotificationIdModel.create({ notificationId })
}
