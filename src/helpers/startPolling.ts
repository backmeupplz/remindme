import { Notification } from '@/models/Notification'
import {
  getCurrentNotificationId,
  setCurrentNotificationId,
} from '@/helpers/currentNotificationId'
import axios from 'axios'
import handleNotification from '@/helpers/handleNotification'
import wallet from '@/helpers/wallet'

function fetchNotifications(next: string) {
  return axios.get<{
    result: {
      notifications?: { [key: string]: Notification }
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
  console.log('Polling notifications!')
  try {
    const currentNotificationId = await getCurrentNotificationId()
    let currentNotificationIdInSet = true
    let next = ''
    const notifications = [] as Notification[]
    do {
      if (next) {
        console.log('Fetching next page!', next)
      }
      const result = await fetchNotifications(next)
      const data = result.data
      notifications.push(...Object.values(data.result.notifications || {}))
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
      await handleNotification(notification)
    }
  } catch (error) {
    console.error(error)
  } finally {
    polling = false
  }
}

export default function () {
  void pollNotifications()
  setInterval(pollNotifications, 10 * 1000)
}
