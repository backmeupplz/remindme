import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import ReminderStatus from '@/models/ReminderStatus'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Reminder {
  @prop({ index: true, required: true })
  fireTime!: number
  @prop({ index: true, required: true })
  replyToCastId!: string
  @prop({ index: true, required: true })
  username!: string
  @prop({
    index: true,
    required: true,
    enum: ReminderStatus,
    default: ReminderStatus.pending,
  })
  status!: ReminderStatus
}

export const ReminderModel = getModelForClass(Reminder)
