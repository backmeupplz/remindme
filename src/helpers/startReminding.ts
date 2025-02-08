import { ReminderModel } from '@/models/Reminder'
import ReminderStatus from '@/models/ReminderStatus'
import humanizer from '@/helpers/humanizer'
import publishCast from '@/helpers/publishCast'
import { hexToUint8Array } from '@/helpers/bufferUtils'

let running = false
async function runReminders() {
  if (running) return
  running = true
  try {
    const timestamp = Date.now() / 1000
    const reminders = await ReminderModel.find({
      fireTime: {
        $lte: timestamp,
      },
      status: ReminderStatus.pending,
    })
    if (!reminders.length) return
    console.log('Running reminders', reminders.length)
    for (const reminder of reminders) {
      reminder.status = ReminderStatus.fired
      await reminder.save()
      await publishCast({
        text: `👋 you asked me to remind you about this cast in ${humanizer(
          reminder.duration
        )} 🫡`,
        parentCastId: { hash: hexToUint8Array(reminder.replyToCastId), fid: reminder.replyToCastAuthorFid }
      })
    }
  } catch (error) {
    console.error(
      'Error running reminders',
      error instanceof Error ? error.message : error
    )
  } finally {
    running = false
  }
}

export default function () {
  void runReminders()
  setInterval(runReminders, 1 * 1000)
}
