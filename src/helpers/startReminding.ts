import { ReminderModel } from '@/models/Reminder'
import ReminderStatus from '@/models/ReminderStatus'
import humanizer from '@/helpers/humanizer'
import publishCast from '@/helpers/publishCast'

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
    console.log('Running reminders', reminders.length)
    for (const reminder of reminders) {
      reminder.status = ReminderStatus.fired
      await reminder.save()
      await publishCast(
        `👋 @${
          reminder.username
        } you asked me to remind you about this cast in ${humanizer(
          reminder.duration * 1000
        )} 🫡`,
        reminder.replyToCastId
      )
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
  setTimeout(runReminders, 1 * 1000)
}
