import { Notification } from '@/models/Notification'
import {
  getCurrentNotificationId,
  setCurrentNotificationId,
} from '@/helpers/currentNotificationId'
import axios from 'axios'
import wallet from '@/helpers/wallet'

function fetchNotifications(next: string) {
  return axios.get<{
    result: {
      notifications?: Notification[]
    }
    meta?: {
      next?: string
    }
  }>(
    next ||
      `https://api.farcaster.xyz/v1/notifications?address=${wallet.address}&per_page=10`
  )
}

let polling = false
async function pollNotifications() {
  if (polling) return
  polling = true
  try {
    const currentNotificationId = await getCurrentNotificationId()
    let currentNotificationIdInSet = true
    let next = ''
    const notifications = [] as Notification[]
    do {
      const result = await fetchNotifications(next)
      const data = result.data
      notifications.push(...(data.result.notifications || []))
      if (currentNotificationId) {
        next = data.meta?.next || ''
        currentNotificationIdInSet = notifications.some(
          (n) => n.id === currentNotificationId
        )
      }
    } while (!!currentNotificationId && !currentNotificationIdInSet && !!next)
    if (notifications[0]?.id) {
      await setCurrentNotificationId(notifications[0].id)
    }
    for (const notification of notifications) {
      console.log(notification)
    }
  } catch (error) {
    console.error(error)
  } finally {
    polling = false
  }
}

export default function () {
  setInterval(pollNotifications, 10 * 1000)
}
